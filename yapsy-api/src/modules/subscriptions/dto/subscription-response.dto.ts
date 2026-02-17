import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanInterval, SubscriptionStatus } from '../../../common/enums';

export class SubscriptionPlanResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Pro Monthly' })
  name: string;

  @ApiPropertyOptional({ nullable: true })
  razorpay_plan_id: string | null;

  @ApiProperty({ example: 29900, description: 'Price in paise' })
  price_amount: number;

  @ApiProperty({ example: 'INR' })
  currency: string;

  @ApiProperty({ enum: PlanInterval })
  interval: PlanInterval;

  @ApiProperty({ type: 'object', additionalProperties: true, example: {} })
  features: Record<string, unknown>;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;

  @ApiProperty({ format: 'date-time' })
  updated_at: Date;
}

export class SubscriptionStatusPlanDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Pro Monthly' })
  name: string;

  @ApiProperty({ example: 29900 })
  price_amount: number;

  @ApiProperty({ example: 'INR' })
  currency: string;

  @ApiProperty({ enum: PlanInterval })
  interval: PlanInterval;

  @ApiProperty({ type: 'object', additionalProperties: true })
  features: Record<string, unknown>;
}

export class SubscriptionStatusResponseDto {
  @ApiProperty({ enum: SubscriptionStatus })
  subscription_status: SubscriptionStatus;

  @ApiPropertyOptional({ nullable: true })
  razorpay_subscription_id: string | null;

  @ApiPropertyOptional({ type: SubscriptionStatusPlanDto, nullable: true })
  plan: SubscriptionStatusPlanDto | null;
}

export class CreateSubscriptionResponseDto {
  @ApiProperty({ example: 'sub_abc123' })
  subscription_id: string;

  @ApiProperty({ example: 'https://rzp.io/i/abc123' })
  short_url: string;

  @ApiProperty({ example: 'created' })
  status: string;
}

export class VerifyPaymentResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Payment verified successfully' })
  message: string;
}

export class CancelSubscriptionResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Subscription cancelled' })
  message: string;
}
