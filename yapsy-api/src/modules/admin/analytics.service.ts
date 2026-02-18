import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SubscriptionStatus } from '../../common/enums';
import { User } from '../users/entities/user.entity';
import { Journal } from '../journals/entities/journal.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Journal)
    private readonly journalRepo: Repository<Journal>,
    private readonly dataSource: DataSource,
  ) {}

  async getMoodDistribution(): Promise<{
    low: number;
    medium: number;
    high: number;
    total: number;
  }> {
    const result = await this.journalRepo
      .createQueryBuilder('j')
      .select(
        'SUM(CASE WHEN j.mood_score >= 1 AND j.mood_score <= 3 THEN 1 ELSE 0 END)',
        'low',
      )
      .addSelect(
        'SUM(CASE WHEN j.mood_score >= 4 AND j.mood_score <= 6 THEN 1 ELSE 0 END)',
        'medium',
      )
      .addSelect(
        'SUM(CASE WHEN j.mood_score >= 7 AND j.mood_score <= 10 THEN 1 ELSE 0 END)',
        'high',
      )
      .addSelect('COUNT(*)', 'total')
      .where('j.mood_score IS NOT NULL')
      .getRawOne<{
        low: string;
        medium: string;
        high: string;
        total: string;
      }>();

    return {
      low: parseInt(result?.low ?? '0', 10),
      medium: parseInt(result?.medium ?? '0', 10),
      high: parseInt(result?.high ?? '0', 10),
      total: parseInt(result?.total ?? '0', 10),
    };
  }

  async getRetention(cohortMonths: number): Promise<
    {
      cohort_month: string;
      total_users: number;
      retained_users: number;
      rate: number;
    }[]
  > {
    const results: {
      cohort_month: string;
      total_users: number;
      retained_users: number;
      rate: number;
    }[] = [];

    for (let i = 0; i < cohortMonths; i++) {
      const cohortStart = new Date();
      cohortStart.setMonth(cohortStart.getMonth() - i);
      cohortStart.setDate(1);
      cohortStart.setHours(0, 0, 0, 0);
      const cohortEnd = new Date(cohortStart);
      cohortEnd.setMonth(cohortEnd.getMonth() + 1);

      const cohortStartStr = cohortStart.toISOString().split('T')[0];
      const cohortEndStr = cohortEnd.toISOString().split('T')[0];

      const totalUsersResult = await this.userRepo
        .createQueryBuilder('u')
        .select('COUNT(*)', 'count')
        .where('u.created_at >= :start', { start: cohortStartStr })
        .andWhere('u.created_at < :end', { end: cohortEndStr })
        .getRawOne<{ count: string }>();

      const totalUsers = parseInt(totalUsersResult?.count ?? '0', 10);

      const retainedResult = await this.userRepo
        .createQueryBuilder('u')
        .select('COUNT(DISTINCT u.id)', 'count')
        .innerJoin('journals', 'j', 'j.user_id = u.id')
        .where('u.created_at >= :start', { start: cohortStartStr })
        .andWhere('u.created_at < :end', { end: cohortEndStr })
        .getRawOne<{ count: string }>();

      const retainedUsers = parseInt(retainedResult?.count ?? '0', 10);
      const rate = totalUsers > 0 ? (retainedUsers / totalUsers) * 100 : 0;

      results.push({
        cohort_month: cohortStartStr.slice(0, 7),
        total_users: totalUsers,
        retained_users: retainedUsers,
        rate: Math.round(rate * 100) / 100,
      });
    }

    return results.reverse();
  }

  async getFeatureUsage(): Promise<{
    avg_check_ins_per_user: number;
    avg_duration: number;
    total_conversations: number;
  }> {
    const [userStats, journalStats] = await Promise.all([
      this.userRepo
        .createQueryBuilder('u')
        .select('COUNT(*)', 'user_count')
        .addSelect('COALESCE(SUM(u.total_check_ins), 0)', 'total_check_ins')
        .getRawOne<{ user_count: string; total_check_ins: string }>(),
      this.journalRepo
        .createQueryBuilder('j')
        .select('COUNT(*)', 'count')
        .addSelect('COALESCE(AVG(j.duration_seconds), 0)', 'avg_duration')
        .getRawOne<{ count: string; avg_duration: string }>(),
    ]);

    const userCount = parseInt(userStats?.user_count ?? '0', 10);
    const totalCheckIns = parseInt(userStats?.total_check_ins ?? '0', 10);
    const totalConversations = parseInt(journalStats?.count ?? '0', 10);
    const avgDuration = parseFloat(journalStats?.avg_duration ?? '0');

    const avg_check_ins_per_user =
      userCount > 0 ? Math.round((totalCheckIns / userCount) * 100) / 100 : 0;

    return {
      avg_check_ins_per_user,
      avg_duration: Math.round(avgDuration * 100) / 100,
      total_conversations: totalConversations,
    };
  }

  async getConversionFunnel(): Promise<{
    registered: number;
    first_check_in: number;
    pro: number;
    conversion_rate: number;
  }> {
    const [registered, firstCheckIn, pro] = await Promise.all([
      this.userRepo.count(),
      this.userRepo
        .createQueryBuilder('u')
        .select('COUNT(DISTINCT u.id)', 'count')
        .innerJoin('journals', 'j', 'j.user_id = u.id')
        .getRawOne<{ count: string }>(),
      this.userRepo.count({
        where: { subscription_status: SubscriptionStatus.PRO },
      }),
    ]);

    const first_check_in = parseInt(firstCheckIn?.count ?? '0', 10);
    const conversion_rate = registered > 0 ? (pro / registered) * 100 : 0;

    return {
      registered,
      first_check_in,
      pro,
      conversion_rate: Math.round(conversion_rate * 100) / 100,
    };
  }

  async getThemes(): Promise<{ theme: string; count: number }[]> {
    const result = await this.dataSource.query<
      { theme: string; count: string }[]
    >(
      `
      SELECT theme, COUNT(*)::text as count
      FROM journals, unnest(themes) AS theme
      WHERE array_length(themes, 1) > 0
      GROUP BY theme
      ORDER BY COUNT(*) DESC
      LIMIT 20
      `,
    );

    return (result ?? []).map((r) => ({
      theme: r.theme,
      count: parseInt(r.count, 10),
    }));
  }
}
