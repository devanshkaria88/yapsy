import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { PlanInterval } from '../../../common/enums';

export class CreatePlanDto {
  @ApiProperty({ description: 'Plan name', example: 'Pro Monthly' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Price in paise', example: 99900 })
  @IsInt()
  @Min(0)
  price_amount: number;

  @ApiPropertyOptional({ description: 'Currency code', default: 'INR' })
  @IsOptional()
  @IsString()
  currency?: string = 'INR';

  @ApiProperty({ description: 'Billing interval', enum: PlanInterval })
  @IsEnum(PlanInterval)
  interval: PlanInterval;

  @ApiPropertyOptional({ description: 'Plan features as key-value pairs' })
  @IsOptional()
  @IsObject()
  features?: Record<string, unknown>;

  @ApiPropertyOptional({ description: 'Whether plan is active', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}
