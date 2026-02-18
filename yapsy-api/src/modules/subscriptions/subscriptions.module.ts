import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import { RazorpayService } from './razorpay.service';
import { SubscriptionsService } from './subscriptions.service';
import { AdminSubscriptionsController } from './admin-subscriptions.controller';
import { SubscriptionsController } from './subscriptions.controller';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan, WebhookEvent, User])],
  controllers: [
    SubscriptionsController,
    AdminSubscriptionsController,
    WebhookController,
  ],
  providers: [SubscriptionsService, RazorpayService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
