import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: 'Subscription plan UUID' })
  @IsUUID()
  plan_id: string;

  @ApiPropertyOptional({ description: 'Promo code for discount' })
  @IsOptional()
  @IsString()
  promo_code?: string;
}
