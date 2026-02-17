import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, SubscriptionStatus } from '../../../common/enums';

export class UserProfileResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  firebase_uid: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiPropertyOptional({ nullable: true })
  name: string | null;

  @ApiPropertyOptional({ nullable: true })
  avatar_url: string | null;

  @ApiPropertyOptional({ nullable: true })
  auth_provider: string | null;

  @ApiProperty({ example: 'Asia/Kolkata' })
  timezone: string;

  @ApiProperty()
  is_onboarded: boolean;

  @ApiPropertyOptional({ nullable: true, format: 'date' })
  date_of_birth: string | null;

  @ApiPropertyOptional({ nullable: true, enum: Gender })
  gender: Gender | null;

  @ApiProperty({ enum: SubscriptionStatus })
  subscription_status: SubscriptionStatus;

  @ApiPropertyOptional({ nullable: true })
  razorpay_subscription_id: string | null;

  @ApiPropertyOptional({ nullable: true })
  razorpay_customer_id: string | null;

  @ApiProperty({ example: 5 })
  current_streak: number;

  @ApiProperty({ example: 42 })
  total_check_ins: number;

  @ApiProperty({ example: 3 })
  weekly_check_in_count: number;

  @ApiPropertyOptional({ nullable: true, format: 'date' })
  weekly_check_in_reset_date: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'date' })
  last_check_in_date: string | null;

  @ApiPropertyOptional({ nullable: true })
  fcm_token: string | null;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;

  @ApiProperty({ format: 'date-time' })
  updated_at: Date;
}
