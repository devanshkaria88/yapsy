import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionStatus } from '../../common/enums';
import { PlanInterval } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import { Journal } from '../journals/entities/journal.entity';
import { SubscriptionPlan } from '../subscriptions/entities/subscription-plan.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Journal)
    private readonly journalRepo: Repository<Journal>,
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,
  ) {}

  async getOverview(): Promise<{
    total_users: number;
    active_pro: number;
    mrr: number;
    total_check_ins: number;
    active_today: number;
  }> {
    const today = new Date().toISOString().split('T')[0];

    const [totalUsers, activePro, totalCheckInsResult, activeToday] =
      await Promise.all([
        this.userRepo.count(),
        this.userRepo.count({
          where: { subscription_status: SubscriptionStatus.PRO },
        }),
        this.userRepo
          .createQueryBuilder('u')
          .select('COALESCE(SUM(u.total_check_ins), 0)', 'sum')
          .getRawOne<{ sum: string }>(),
        this.userRepo.count({
          where: { last_check_in_date: today },
        }),
      ]);

    const activePlans = await this.planRepo.find({
      where: { is_active: true },
    });

    let mrr = 0;
    if (activePro > 0 && activePlans.length > 0) {
      const avgMonthlyPrice =
        activePlans.reduce((sum, p) => {
          return (
            sum +
            (p.interval === PlanInterval.MONTHLY
              ? p.price_amount
              : p.price_amount / 12)
          );
        }, 0) / activePlans.length;
      mrr = Math.round(activePro * avgMonthlyPrice);
    }

    const total_check_ins = parseInt(
      totalCheckInsResult?.sum ?? '0',
      10,
    );

    return {
      total_users: totalUsers,
      active_pro: activePro,
      mrr,
      total_check_ins,
      active_today: activeToday,
    };
  }

  async getGrowth(days: number): Promise<{ date: string; count: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startStr = startDate.toISOString().split('T')[0];

    const result = await this.userRepo
      .createQueryBuilder('u')
      .select("DATE(u.created_at)::text", "date")
      .addSelect("COUNT(*)", "count")
      .where("u.created_at >= :start", { start: startStr })
      .groupBy("DATE(u.created_at)")
      .orderBy("date", "ASC")
      .getRawMany<{ date: string; count: string }>();

    return result.map((r) => ({
      date: r.date,
      count: parseInt(r.count, 10),
    }));
  }

  async getCheckIns(days: number): Promise<{ date: string; count: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startStr = startDate.toISOString().split('T')[0];

    const result = await this.journalRepo
      .createQueryBuilder('j')
      .select("j.date", "date")
      .addSelect("COUNT(*)", "count")
      .where("j.date >= :start", { start: startStr })
      .groupBy("j.date")
      .orderBy("j.date", "ASC")
      .getRawMany<{ date: string; count: string }>();

    return result.map((r) => ({
      date: r.date,
      count: parseInt(r.count, 10),
    }));
  }

  async getRevenue(): Promise<{
    mrr: number;
    mrr_inr: string;
    subscriber_count: number;
    plans: { id: string; name: string; price_amount: number; count: number }[];
  }> {
    const [activePro, plans] = await Promise.all([
      this.userRepo.count({
        where: { subscription_status: SubscriptionStatus.PRO },
      }),
      this.planRepo.find({ where: { is_active: true } }),
    ]);

    let mrr = 0;
    if (activePro > 0 && plans.length > 0) {
      const avgMonthlyPrice =
        plans.reduce((sum, p) => {
          return (
            sum +
            (p.interval === PlanInterval.MONTHLY
              ? p.price_amount
              : p.price_amount / 12)
          );
        }, 0) / plans.length;
      mrr = Math.round(activePro * avgMonthlyPrice);
    }

    const planBreakdown = plans.map((p) => ({
      id: p.id,
      name: p.name,
      price_amount: p.price_amount,
      count: 0,
    }));

    return {
      mrr,
      mrr_inr: (mrr / 100).toFixed(2),
      subscriber_count: activePro,
      plans: planBreakdown,
    };
  }
}
