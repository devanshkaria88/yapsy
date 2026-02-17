import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PromoType } from '../../../common/enums';

export class PromoCodeResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'WELCOME50' })
  code: string;

  @ApiProperty({ enum: PromoType })
  type: PromoType;

  @ApiProperty({ example: 50 })
  value: number;

  @ApiPropertyOptional({ nullable: true, example: 3 })
  duration_months: number | null;

  @ApiPropertyOptional({ nullable: true, example: 100 })
  max_uses: number | null;

  @ApiProperty({ example: 5 })
  current_uses: number;

  @ApiProperty({ format: 'date-time' })
  valid_from: Date;

  @ApiPropertyOptional({ nullable: true, format: 'date-time' })
  valid_until: Date | null;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;

  @ApiProperty({ format: 'date-time' })
  updated_at: Date;
}

export class ValidatePromoResponseDto {
  @ApiProperty({ type: PromoCodeResponseDto })
  promo: PromoCodeResponseDto;

  @ApiProperty({ example: 14950, description: 'Discount amount in paise' })
  discountAmount: number;

  @ApiProperty({ example: 14950, description: 'Final price after discount in paise' })
  finalPrice: number;
}

export class UserPromoRedemptionResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  user_id: string;

  @ApiProperty({ format: 'uuid' })
  promo_code_id: string;

  @ApiProperty({ format: 'date-time' })
  redeemed_at: Date;

  @ApiPropertyOptional({ nullable: true, format: 'date-time' })
  effective_until: Date | null;
}

export class RedeemPromoResponseDto {
  @ApiProperty({ type: UserPromoRedemptionResponseDto })
  redemption: UserPromoRedemptionResponseDto;

  @ApiProperty({ example: 14950 })
  discountAmount: number;

  @ApiProperty({ example: 14950 })
  finalPrice: number;

  @ApiProperty({ format: 'date-time' })
  effectiveUntil: Date;
}
