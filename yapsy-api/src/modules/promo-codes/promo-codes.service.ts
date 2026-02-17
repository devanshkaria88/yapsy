import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PromoType } from '../../common/enums';
import { PaginatedResult, PaginationDto } from '../../common/dto/pagination.dto';
import { PromoCode } from './entities/promo-code.entity';
import { UserPromoRedemption } from './entities/user-promo-redemption.entity';
import { CreatePromoDto, UpdatePromoDto } from './dto';

export interface ValidatePromoResult {
  promo: PromoCode;
  discountAmount: number;
  finalPrice: number;
}

export interface RedeemPromoResult {
  redemption: UserPromoRedemption;
  discountAmount: number;
  finalPrice: number;
  effectiveUntil: Date;
}

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectRepository(PromoCode)
    private readonly promoRepo: Repository<PromoCode>,
    @InjectRepository(UserPromoRedemption)
    private readonly redemptionRepo: Repository<UserPromoRedemption>,
    private readonly dataSource: DataSource,
  ) {}

  calculateDiscount(promo: PromoCode, originalPrice: number): number {
    switch (promo.type) {
      case PromoType.PERCENTAGE:
        return Math.round((originalPrice * promo.value) / 100);
      case PromoType.FLAT:
        return promo.value;
      case PromoType.SET_PRICE:
        return Math.max(0, originalPrice - promo.value);
      default:
        return 0;
    }
  }

  async validate(code: string, originalPrice = 0): Promise<ValidatePromoResult> {
    const normalizedCode = code.toUpperCase();
    const promo = await this.promoRepo.findOne({
      where: { code: normalizedCode },
    });

    if (!promo) {
      throw new HttpException(
        { code: 'PROMO_NOT_FOUND', message: 'Promo code not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (!promo.is_active) {
      throw new HttpException(
        { code: 'PROMO_NOT_ACTIVE', message: 'Promo code is not active' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const now = new Date();
    if (promo.valid_from > now) {
      throw new HttpException(
        { code: 'PROMO_NOT_YET_VALID', message: 'Promo code is not yet valid' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (promo.valid_until && promo.valid_until < now) {
      throw new HttpException(
        { code: 'PROMO_EXPIRED', message: 'Promo code has expired' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (promo.max_uses != null && promo.current_uses >= promo.max_uses) {
      throw new HttpException(
        {
          code: 'PROMO_MAX_USES_REACHED',
          message: 'Promo code has reached maximum redemptions',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const discountAmount = this.calculateDiscount(promo, originalPrice);
    const finalPrice = Math.max(0, originalPrice - discountAmount);

    return {
      promo,
      discountAmount,
      finalPrice,
    };
  }

  async redeem(userId: string, code: string, originalPrice = 0): Promise<RedeemPromoResult> {
    const normalizedCode = code.toUpperCase();
    const validateResult = await this.validate(normalizedCode, originalPrice);
    const { promo } = validateResult;

    const existingRedemption = await this.redemptionRepo.findOne({
      where: { user_id: userId, promo_code_id: promo.id },
    });

    if (existingRedemption) {
      throw new HttpException(
        {
          code: 'PROMO_ALREADY_REDEEMED',
          message: 'You have already redeemed this promo code',
        },
        HttpStatus.CONFLICT,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const redeemedAt = new Date();
      let effectiveUntil: Date | null = null;
      if (promo.duration_months) {
        effectiveUntil = new Date(redeemedAt);
        effectiveUntil.setMonth(effectiveUntil.getMonth() + promo.duration_months);
      }

      const redemption = queryRunner.manager.create(UserPromoRedemption, {
        user_id: userId,
        promo_code_id: promo.id,
        redeemed_at: redeemedAt,
        effective_until: effectiveUntil ?? undefined,
      });
      await queryRunner.manager.save(redemption);

      await queryRunner.manager.increment(PromoCode, { id: promo.id }, 'current_uses', 1);

      await queryRunner.commitTransaction();

      const savedRedemption = await this.redemptionRepo.findOne({
        where: { id: redemption.id },
        relations: ['promo_code'],
      });

      const discountAmount = this.calculateDiscount(promo, originalPrice);
      const finalPrice = Math.max(0, originalPrice - discountAmount);

      return {
        redemption: savedRedemption!,
        discountAmount,
        finalPrice,
        effectiveUntil: effectiveUntil ?? redeemedAt,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: PaginationDto): Promise<PaginatedResult<PromoCode>> {
    const { page = 1, limit = 20 } = query;
    const [items, total] = await this.promoRepo.findAndCount({
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return new PaginatedResult(items, total, page, limit);
  }

  async create(dto: CreatePromoDto): Promise<PromoCode> {
    const code = typeof dto.code === 'string' ? dto.code.toUpperCase() : dto.code;
    const existing = await this.promoRepo.findOne({ where: { code } });
    if (existing) {
      throw new BadRequestException({
        code: 'PROMO_CODE_EXISTS',
        message: 'A promo code with this code already exists',
      });
    }

    const promo = this.promoRepo.create({
      ...dto,
      code,
      valid_from: new Date(dto.valid_from),
      valid_until: dto.valid_until ? new Date(dto.valid_until) : undefined,
    });
    return this.promoRepo.save(promo);
  }

  async update(id: string, dto: UpdatePromoDto): Promise<PromoCode> {
    const promo = await this.promoRepo.findOne({ where: { id } });
    if (!promo) {
      throw new NotFoundException('Promo code not found');
    }

    const updateData: Record<string, unknown> = {};
    if (dto.code !== undefined) {
      updateData.code = typeof dto.code === 'string' ? dto.code.toUpperCase() : dto.code;
    }
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.value !== undefined) updateData.value = dto.value;
    if (dto.duration_months !== undefined) updateData.duration_months = dto.duration_months;
    if (dto.max_uses !== undefined) updateData.max_uses = dto.max_uses;
    if (dto.valid_from !== undefined) {
      updateData.valid_from = new Date(dto.valid_from);
    }
    if (dto.valid_until !== undefined) {
      updateData.valid_until = dto.valid_until ? new Date(dto.valid_until) : null;
    }
    if (dto.is_active !== undefined) updateData.is_active = dto.is_active;

    await this.promoRepo.update(id, updateData);
    return this.promoRepo.findOneOrFail({ where: { id } });
  }

  async deactivate(id: string): Promise<void> {
    const result = await this.promoRepo.update(id, { is_active: false });
    if (result.affected === 0) {
      throw new NotFoundException('Promo code not found');
    }
  }

  async getRedemptions(promoId: string) {
    const promo = await this.promoRepo.findOne({ where: { id: promoId } });
    if (!promo) {
      throw new NotFoundException('Promo code not found');
    }

    return this.redemptionRepo.find({
      where: { promo_code_id: promoId },
      relations: ['user'],
      order: { redeemed_at: 'DESC' },
    });
  }
}
