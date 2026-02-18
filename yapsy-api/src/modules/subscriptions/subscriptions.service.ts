import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SubscriptionStatus } from '../../common/enums';
import { PlanInterval } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import {
  CreatePlanDto,
  CreateSubscriptionDto,
  UpdatePlanDto,
  VerifyPaymentDto,
} from './dto';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import { RazorpayService } from './razorpay.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,
    @InjectRepository(WebhookEvent)
    private readonly webhookRepo: Repository<WebhookEvent>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly razorpayService: RazorpayService,
    private readonly dataSource: DataSource,
  ) {}

  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.planRepo.find({
      where: { is_active: true },
      order: { price_amount: 'ASC' },
    });
  }

  async getStatus(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: [
        'id',
        'subscription_status',
        'razorpay_subscription_id',
        'razorpay_customer_id',
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let plan: SubscriptionPlan | null = null;
    if (user.razorpay_subscription_id && this.razorpayService.isConfigured()) {
      try {
        const razorpaySub = await this.razorpayService.getSubscription(
          user.razorpay_subscription_id,
        );
        if (razorpaySub.plan_id) {
          plan = await this.planRepo.findOne({
            where: { razorpay_plan_id: razorpaySub.plan_id },
          });
        }
      } catch {
        plan = null;
      }
    }

    return {
      subscription_status: user.subscription_status,
      razorpay_subscription_id: user.razorpay_subscription_id,
      plan: plan
        ? {
            id: plan.id,
            name: plan.name,
            price_amount: plan.price_amount,
            currency: plan.currency,
            interval: plan.interval,
            features: plan.features,
          }
        : null,
    };
  }

  async createSubscription(userId: string, dto: CreateSubscriptionDto) {
    const plan = await this.planRepo.findOne({
      where: { id: dto.plan_id, is_active: true },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found or inactive');
    }

    if (!plan.razorpay_plan_id) {
      throw new BadRequestException('Plan is not configured for Razorpay');
    }

    const user = await this.userRepo.findOneOrFail({
      where: { id: userId },
    });

    let customerId = user.razorpay_customer_id;
    if (!customerId) {
      const customer = await this.razorpayService.createCustomer(
        user.email,
        user.name,
      );
      customerId = customer.id;
    }

    const totalCount = plan.interval === PlanInterval.MONTHLY ? 12 : 1;
    const subscription = await this.razorpayService.createSubscription(
      plan.razorpay_plan_id,
      customerId,
      totalCount,
    );

    await this.userRepo.update(userId, {
      razorpay_customer_id: customerId,
      razorpay_subscription_id: subscription.id,
    });

    return {
      subscription_id: subscription.id,
      short_url: subscription.short_url,
      status: subscription.status,
    };
  }

  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    const isValid = this.razorpayService.verifyPaymentSignature(
      dto.razorpay_payment_id,
      dto.razorpay_subscription_id,
      dto.razorpay_signature,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid payment signature');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.razorpay_subscription_id !== dto.razorpay_subscription_id) {
      throw new BadRequestException('Subscription does not belong to user');
    }

    await this.userRepo.update(userId, {
      subscription_status: SubscriptionStatus.PRO,
    });

    return { success: true, message: 'Payment verified successfully' };
  }

  async cancelSubscription(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.razorpay_subscription_id) {
      throw new BadRequestException('No active subscription to cancel');
    }

    await this.razorpayService.cancelSubscription(
      user.razorpay_subscription_id,
    );

    await this.userRepo.update(userId, {
      subscription_status: SubscriptionStatus.CANCELLED,
    });

    return { success: true, message: 'Subscription cancelled' };
  }

  async processWebhook(
    payload: Record<string, unknown>,
    signature: string,
    rawBody: string,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const eventType = (payload.event as string) || 'unknown';
      const razorpayEventId = (payload as { id?: string }).id;

      if (razorpayEventId) {
        const duplicate = await queryRunner.manager.findOne(WebhookEvent, {
          where: { razorpay_event_id: razorpayEventId },
        });
        if (duplicate) {
          await queryRunner.rollbackTransaction();
          return;
        }
      }

      const webhookEvent = queryRunner.manager.create(WebhookEvent, {
        source: 'razorpay',
        event_type: eventType,
        payload,
        processed: false,
        razorpay_event_id: razorpayEventId,
      });
      await queryRunner.manager.save(WebhookEvent, webhookEvent);

      const isValid = this.razorpayService.verifyWebhookSignature(
        rawBody,
        signature,
      );

      if (!isValid) {
        await queryRunner.manager.update(
          WebhookEvent,
          { id: webhookEvent.id },
          { error: 'Invalid signature', processed: false },
        );
        await queryRunner.rollbackTransaction();
        throw new BadRequestException('Invalid webhook signature');
      }

      const paymentPayload = payload.payload as
        | { subscription?: { entity?: { id?: string } } }
        | undefined;
      const subscriptionId = paymentPayload?.subscription?.entity?.id;

      if (subscriptionId) {
        const user = await queryRunner.manager.findOne(User, {
          where: { razorpay_subscription_id: subscriptionId },
        });

        if (user) {
          switch (eventType) {
            case 'subscription.activated':
            case 'subscription.authenticated':
              await queryRunner.manager.update(
                User,
                { id: user.id },
                { subscription_status: SubscriptionStatus.PRO },
              );
              break;
            case 'subscription.cancelled':
            case 'subscription.completed':
            case 'subscription.halted':
              await queryRunner.manager.update(
                User,
                { id: user.id },
                { subscription_status: SubscriptionStatus.CANCELLED },
              );
              break;
            case 'subscription.paused':
              await queryRunner.manager.update(
                User,
                { id: user.id },
                { subscription_status: SubscriptionStatus.PAUSED },
              );
              break;
            case 'subscription.pending':
              break;
            default:
              break;
          }
        }
      }

      await queryRunner.manager.update(
        WebhookEvent,
        { id: webhookEvent.id },
        { processed: true, processed_at: new Date() },
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async retryWebhook(id: string): Promise<void> {
    const webhook = await this.webhookRepo.findOne({ where: { id } });
    if (!webhook) {
      throw new NotFoundException('Webhook event not found');
    }

    const payload = webhook.payload as { event?: string; payload?: unknown };
    const eventType = (payload.event as string) || 'unknown';
    const paymentPayload = payload.payload as
      | { subscription?: { entity?: { id?: string } } }
      | undefined;
    const subscriptionId = paymentPayload?.subscription?.entity?.id;

    if (subscriptionId) {
      const user = await this.userRepo.findOne({
        where: { razorpay_subscription_id: subscriptionId },
      });

      if (user) {
        switch (eventType) {
          case 'subscription.activated':
          case 'subscription.authenticated':
            await this.userRepo.update(user.id, {
              subscription_status: SubscriptionStatus.PRO,
            });
            break;
          case 'subscription.cancelled':
          case 'subscription.completed':
          case 'subscription.halted':
            await this.userRepo.update(user.id, {
              subscription_status: SubscriptionStatus.CANCELLED,
            });
            break;
          case 'subscription.paused':
            await this.userRepo.update(user.id, {
              subscription_status: SubscriptionStatus.PAUSED,
            });
            break;
          default:
            break;
        }
      }
    }

    await this.webhookRepo
      .createQueryBuilder()
      .update(WebhookEvent)
      .set({
        processed: true,
        processed_at: new Date(),
        error: () => 'NULL',
      })
      .where('id = :id', { id })
      .execute();
  }

  async getPlansAdmin(): Promise<SubscriptionPlan[]> {
    return this.planRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async createPlan(dto: CreatePlanDto): Promise<SubscriptionPlan> {
    const plan = this.planRepo.create({
      name: dto.name,
      price_amount: dto.price_amount,
      currency: dto.currency ?? 'INR',
      interval: dto.interval,
      features: dto.features ?? {},
      is_active: dto.is_active ?? true,
    });
    return this.planRepo.save(plan);
  }

  async updatePlan(id: string, dto: UpdatePlanDto): Promise<SubscriptionPlan> {
    const plan = await this.planRepo.findOneOrFail({ where: { id } });
    Object.assign(plan, dto);
    return this.planRepo.save(plan);
  }

  async deactivatePlan(id: string): Promise<void> {
    await this.planRepo.update(id, { is_active: false });
  }

  async getStats() {
    const [totalPro, totalFree, totalCancelled] = await Promise.all([
      this.userRepo.count({
        where: { subscription_status: SubscriptionStatus.PRO },
      }),
      this.userRepo.count({
        where: { subscription_status: SubscriptionStatus.FREE },
      }),
      this.userRepo.count({
        where: { subscription_status: SubscriptionStatus.CANCELLED },
      }),
    ]);

    const activePlans = await this.planRepo.find({
      where: { is_active: true },
    });

    let mrr = 0;
    if (totalPro > 0 && activePlans.length > 0) {
      const avgMonthlyPrice =
        activePlans.reduce((sum, p) => {
          return (
            sum +
            (p.interval === PlanInterval.MONTHLY
              ? p.price_amount
              : p.price_amount / 12)
          );
        }, 0) / activePlans.length;
      mrr = Math.round(totalPro * avgMonthlyPrice);
    }

    return {
      total_pro: totalPro,
      total_free: totalFree,
      total_cancelled: totalCancelled,
      mrr_paise: mrr,
      mrr_inr: (mrr / 100).toFixed(2),
    };
  }
}
