import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PromoType } from '../../../common/enums';

export class CreatePromoDto {
  @ApiProperty({
    description: 'Promo code (stored uppercase)',
    example: 'SAVE20',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }): string =>
    typeof value === 'string' ? value.toUpperCase() : String(value),
  )
  code: string;

  @ApiProperty({ enum: PromoType, description: 'Discount type' })
  @IsEnum(PromoType)
  type: PromoType;

  @ApiProperty({
    description:
      'Value: percentage (1-100), flat amount in paise, or set price in paise',
    example: 20,
  })
  @IsInt()
  @Min(0)
  value: number;

  @ApiPropertyOptional({
    description: 'Subscription duration in months when redeemed',
    example: 12,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration_months?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of redemptions allowed',
    example: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_uses?: number;

  @ApiProperty({
    description: 'Valid from date (ISO 8601)',
    example: '2026-01-01T00:00:00.000Z',
  })
  @IsDateString()
  valid_from: string;

  @ApiPropertyOptional({
    description: 'Valid until date (ISO 8601)',
    example: '2026-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  valid_until?: string;

  @ApiPropertyOptional({
    description: 'Whether the promo is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}
