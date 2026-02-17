import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AdminUser } from '../users/entities/admin-user.entity';
import { Journal } from '../journals/entities/journal.entity';
import { Task } from '../tasks/entities/task.entity';
import { SubscriptionPlan } from '../subscriptions/entities/subscription-plan.entity';
import { WebhookEvent } from '../subscriptions/entities/webhook-event.entity';
import { MoodInsight } from '../insights/entities/mood-insight.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AdminUser,
      Journal,
      Task,
      SubscriptionPlan,
      WebhookEvent,
      MoodInsight,
    ]),
    SubscriptionsModule,
  ],
  controllers: [
    DashboardController,
    AnalyticsController,
    SystemController,
    AdminUsersController,
  ],
  providers: [DashboardService, AnalyticsService, SystemService, AdminUsersService],
})
export class AdminModule {}
