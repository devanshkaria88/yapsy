import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../common/dto/pagination.dto';
import { User } from './entities/user.entity';
import {
  AdminUserQueryDto,
  UpdateFcmTokenDto,
  UpdateSubscriptionDto,
  UpdateUserDto,
} from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async getProfile(userId: string) {
    const user = await this.findById(userId);
    const { refresh_token_hash, ...profile } = user;
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateUserDto) {
    await this.findById(userId);
    await this.usersRepository.update(userId, dto);
    return this.getProfile(userId);
  }

  async updateFcmToken(userId: string, dto: UpdateFcmTokenDto): Promise<void> {
    await this.findById(userId);
    await this.usersRepository.update(userId, { fcm_token: dto.fcm_token });
  }

  async deleteAccount(userId: string): Promise<void> {
    await this.findById(userId);
    await this.usersRepository.softDelete(userId);
  }

  private readonly SORTABLE_COLUMNS = [
    'created_at',
    'updated_at',
    'email',
    'name',
    'subscription_status',
  ] as const;

  async findAllAdmin(
    query: AdminUserQueryDto,
  ): Promise<PaginatedResult<Omit<User, 'refresh_token_hash'>>> {
    const { page = 1, limit = 20, search, subscription_status, sort_by = 'created_at', sort_order = 'DESC' } = query;

    const safeSortBy = this.SORTABLE_COLUMNS.includes(sort_by as (typeof this.SORTABLE_COLUMNS)[number])
      ? sort_by
      : 'created_at';

    const qb = this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.firebase_uid',
        'user.email',
        'user.name',
        'user.avatar_url',
        'user.auth_provider',
        'user.timezone',
        'user.is_onboarded',
        'user.date_of_birth',
        'user.gender',
        'user.subscription_status',
        'user.current_streak',
        'user.total_check_ins',
        'user.weekly_check_in_count',
        'user.weekly_check_in_reset_date',
        'user.last_check_in_date',
        'user.created_at',
        'user.updated_at',
        'user.deleted_at',
      ])
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`user.${safeSortBy}`, sort_order);

    if (search) {
      qb.andWhere(
        '(user.email ILIKE :search OR user.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (subscription_status) {
      qb.andWhere('user.subscription_status = :subscription_status', {
        subscription_status,
      });
    }

    const [items, total] = await qb.getManyAndCount();

    return new PaginatedResult(items, total, page, limit);
  }

  async findOneAdmin(userId: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { refresh_token_hash, ...profile } = user;
    return profile;
  }

  async updateSubscriptionStatus(
    userId: string,
    dto: UpdateSubscriptionDto,
  ): Promise<Omit<User, 'refresh_token_hash'>> {
    await this.findById(userId);
    await this.usersRepository.update(userId, {
      subscription_status: dto.subscription_status,
    });
    return this.findOneAdmin(userId);
  }
}
