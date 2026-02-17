import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../common/dto/pagination.dto';
import { Journal } from './entities/journal.entity';
import {
  JournalQueryDto,
  JournalSearchDto,
  JournalStatsQueryDto,
} from './dto';

@Injectable()
export class JournalsService {
  constructor(
    @InjectRepository(Journal)
    private readonly journalsRepo: Repository<Journal>,
  ) {}

  async findAll(
    userId: string,
    query: JournalQueryDto,
  ): Promise<PaginatedResult<Journal>> {
    const { page = 1, limit = 20, from, to } = query;

    const qb = this.journalsRepo
      .createQueryBuilder('journal')
      .where('journal.user_id = :userId', { userId })
      .orderBy('journal.date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (from) {
      qb.andWhere('journal.date >= :from', { from });
    }
    if (to) {
      qb.andWhere('journal.date <= :to', { to });
    }

    const [items, total] = await qb.getManyAndCount();
    return new PaginatedResult(items, total, page, limit);
  }

  async findToday(userId: string): Promise<Journal | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.journalsRepo.findOne({
      where: { user_id: userId, date: today },
    });
  }

  async findOne(userId: string, journalId: string): Promise<Journal> {
    const journal = await this.journalsRepo.findOne({
      where: { id: journalId, user_id: userId },
    });
    if (!journal) {
      throw new NotFoundException('Journal not found');
    }
    return journal;
  }

  async findStats(
    userId: string,
    days: number,
  ): Promise<{
    entries: Journal[];
    avg_mood: number;
    total_entries: number;
  }> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    const from = fromDate.toISOString().split('T')[0];

    const entries = await this.journalsRepo
      .createQueryBuilder('journal')
      .where('journal.user_id = :userId', { userId })
      .andWhere('journal.date >= :from', { from })
      .orderBy('journal.date', 'DESC')
      .getMany();

    const moodsWithScores = entries.filter(
      (j) => j.mood_score != null && !isNaN(j.mood_score),
    );
    const avgMood =
      moodsWithScores.length > 0
        ? moodsWithScores.reduce((sum, j) => sum + j.mood_score, 0) /
          moodsWithScores.length
        : 0;

    return {
      entries,
      avg_mood: Math.round(avgMood * 10) / 10,
      total_entries: entries.length,
    };
  }

  async search(
    userId: string,
    query: JournalSearchDto,
  ): Promise<PaginatedResult<Journal>> {
    const { page = 1, limit = 20, q, theme } = query;
    const keyword = `%${q}%`;

    const qb = this.journalsRepo
      .createQueryBuilder('journal')
      .where('journal.user_id = :userId', { userId })
      .andWhere(
        '(journal.summary ILIKE :keyword OR array_to_string(journal.themes, \' \') ILIKE :keyword)',
        { keyword },
      )
      .orderBy('journal.date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (theme) {
      qb.andWhere(':theme = ANY(journal.themes)', { theme });
    }

    const [items, total] = await qb.getManyAndCount();
    return new PaginatedResult(items, total, page, limit);
  }

  async findByDateRange(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<Journal[]> {
    const fromStr = from.toISOString().split('T')[0];
    const toStr = to.toISOString().split('T')[0];

    return this.journalsRepo
      .createQueryBuilder('journal')
      .where('journal.user_id = :userId', { userId })
      .andWhere('journal.date >= :fromStr', { fromStr })
      .andWhere('journal.date <= :toStr', { toStr })
      .orderBy('journal.date', 'ASC')
      .getMany();
  }
}
