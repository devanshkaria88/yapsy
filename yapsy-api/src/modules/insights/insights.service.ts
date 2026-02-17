import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoodTrend } from '../../common/enums';
import { Journal } from '../journals/entities/journal.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { TaskStatus } from '../../common/enums';
import { LlmProcessorService } from '../journals/llm-processor.service';
import { JournalsService } from '../journals/journals.service';
import { MoodInsight } from './entities/mood-insight.entity';

export interface MoodDataPoint {
  date: string;
  mood_score: number | null;
  mood_label: string | null;
}

export interface ThemeCount {
  theme: string;
  count: number;
}

export interface StreaksResponse {
  current_streak: number;
  longest_streak: number;
  total_check_ins: number;
}

export interface ProductivityPeriod {
  completed: number;
  total: number;
  rate: number;
}

export interface ProductivityResponse {
  week: ProductivityPeriod;
  two_weeks: ProductivityPeriod;
  month: ProductivityPeriod;
}

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Journal)
    private readonly journalsRepo: Repository<Journal>,
    @InjectRepository(Task)
    private readonly tasksRepo: Repository<Task>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(MoodInsight)
    private readonly moodInsightRepo: Repository<MoodInsight>,
    private readonly llmProcessorService: LlmProcessorService,
    private readonly journalsService: JournalsService,
  ) {}

  async getMoodData(
    userId: string,
    days: number,
  ): Promise<MoodDataPoint[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    const from = fromDate.toISOString().split('T')[0];

    const journals = await this.journalsRepo
      .createQueryBuilder('journal')
      .select(['journal.date', 'journal.mood_score', 'journal.mood_label'])
      .where('journal.user_id = :userId', { userId })
      .andWhere('journal.date >= :from', { from })
      .orderBy('journal.date', 'ASC')
      .getMany();

    return journals.map((j) => ({
      date: j.date,
      mood_score: j.mood_score ?? null,
      mood_label: j.mood_label ?? null,
    }));
  }

  async getThemes(userId: string): Promise<ThemeCount[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const from = fromDate.toISOString().split('T')[0];

    const journals = await this.journalsRepo
      .createQueryBuilder('journal')
      .select(['journal.themes'])
      .where('journal.user_id = :userId', { userId })
      .andWhere('journal.date >= :from', { from })
      .getMany();

    const themeCounts = new Map<string, number>();
    for (const j of journals) {
      for (const theme of j.themes || []) {
        const normalized = theme.trim().toLowerCase();
        if (normalized) {
          themeCounts.set(normalized, (themeCounts.get(normalized) ?? 0) + 1);
        }
      }
    }

    return Array.from(themeCounts.entries())
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  async getStreaks(userId: string): Promise<StreaksResponse> {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      select: ['current_streak', 'total_check_ins'],
    });

    const journals = await this.journalsRepo
      .createQueryBuilder('journal')
      .select('journal.date')
      .where('journal.user_id = :userId', { userId })
      .orderBy('journal.date', 'ASC')
      .getMany();

    const dates = [...new Set(journals.map((j) => j.date))].sort();
    let longestStreak = 0;
    let currentRun = 0;
    let prevDate: string | null = null;

    for (const dateStr of dates) {
      const prev = prevDate ? new Date(prevDate) : null;
      const diffDays = prev
        ? Math.round(
            (new Date(dateStr).getTime() - prev.getTime()) / 86400000,
          )
        : 1;

      if (diffDays === 1) {
        currentRun += 1;
      } else {
        longestStreak = Math.max(longestStreak, currentRun);
        currentRun = 1;
      }
      prevDate = dateStr;
    }
    longestStreak = Math.max(longestStreak, currentRun);

    return {
      current_streak: user?.current_streak ?? 0,
      longest_streak: longestStreak,
      total_check_ins: user?.total_check_ins ?? dates.length,
    };
  }

  async getWeeklyInsight(userId: string): Promise<MoodInsight> {
    const weekStart = this.getWeekStart();

    let insight = await this.moodInsightRepo.findOne({
      where: { user_id: userId, week_start: weekStart },
    });

    if (!insight) {
      const from = new Date(weekStart);
      const to = new Date(weekStart);
      to.setDate(to.getDate() + 6);
      const journals = await this.journalsService.findByDateRange(
        userId,
        from,
        to,
      );

      const taskCompletionRate = await this.getTaskCompletionRate(
        userId,
        weekStart,
        this.addDays(weekStart, 6),
      );

      const insightText =
        await this.llmProcessorService.generateWeeklyInsight(
          userId,
          journals,
          taskCompletionRate,
        );

      const moodsWithScores = journals.filter(
        (j) => j.mood_score != null && !isNaN(j.mood_score),
      );
      const avgMood =
        moodsWithScores.length > 0
          ? moodsWithScores.reduce((sum, j) => sum + j.mood_score!, 0) /
            moodsWithScores.length
          : null;

      const themeCounts = new Map<string, number>();
      for (const j of journals) {
        for (const theme of j.themes || []) {
          const t = theme.trim().toLowerCase();
          if (t) themeCounts.set(t, (themeCounts.get(t) ?? 0) + 1);
        }
      }
      const topThemes = Array.from(themeCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([t]) => t);

      const lastWeekStart = this.addDays(weekStart, -7);
      const lastWeekJournals = await this.journalsService.findByDateRange(
        userId,
        new Date(lastWeekStart),
        new Date(this.addDays(lastWeekStart, 6)),
      );
      const lastWeekMoods = lastWeekJournals.filter(
        (j) => j.mood_score != null && !isNaN(j.mood_score),
      );
      const lastWeekAvg =
        lastWeekMoods.length > 0
          ? lastWeekMoods.reduce((sum, j) => sum + j.mood_score!, 0) /
            lastWeekMoods.length
          : null;

      let moodTrend: MoodTrend | null = null;
      if (avgMood != null && lastWeekAvg != null) {
        if (avgMood > lastWeekAvg) moodTrend = MoodTrend.IMPROVING;
        else if (avgMood < lastWeekAvg) moodTrend = MoodTrend.DECLINING;
        else moodTrend = MoodTrend.STABLE;
      }

      insight = this.moodInsightRepo.create({
        user_id: userId,
        week_start: weekStart,
        avg_mood: avgMood ?? undefined,
        mood_trend: moodTrend ?? undefined,
        top_themes: topThemes,
        productivity_score: taskCompletionRate,
        insight_text: insightText,
      });
      await this.moodInsightRepo.save(insight);
    }

    return insight;
  }

  async getProductivity(userId: string): Promise<ProductivityResponse> {
    const today = new Date().toISOString().split('T')[0];

    const week = await this.getProductivityForRange(
      userId,
      this.addDays(today, -7),
      today,
    );
    const twoWeeks = await this.getProductivityForRange(
      userId,
      this.addDays(today, -14),
      today,
    );
    const month = await this.getProductivityForRange(
      userId,
      this.addDays(today, -30),
      today,
    );

    return { week, two_weeks: twoWeeks, month };
  }

  private async getProductivityForRange(
    userId: string,
    from: string,
    to: string,
  ): Promise<ProductivityPeriod> {
    const [completed, total] = await Promise.all([
      this.tasksRepo
        .createQueryBuilder('task')
        .where('task.user_id = :userId', { userId })
        .andWhere('task.scheduled_date >= :from', { from })
        .andWhere('task.scheduled_date <= :to', { to })
        .andWhere('task.status = :status', { status: TaskStatus.COMPLETED })
        .getCount(),
      this.tasksRepo
        .createQueryBuilder('task')
        .where('task.user_id = :userId', { userId })
        .andWhere('task.scheduled_date >= :from', { from })
        .andWhere('task.scheduled_date <= :to', { to })
        .getCount(),
    ]);

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, rate };
  }

  private async getTaskCompletionRate(
    userId: string,
    from: string,
    to: string,
  ): Promise<number> {
    const period = await this.getProductivityForRange(userId, from, to);
    return period.rate;
  }

  private getWeekStart(): string {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    return monday.toISOString().split('T')[0];
  }

  private addDays(dateStr: string, days: number): string {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }
}
