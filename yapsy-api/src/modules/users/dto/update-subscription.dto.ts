import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SubscriptionStatus } from '../../../common/enums';

export class UpdateSubscriptionDto {
  @ApiProperty({ enum: SubscriptionStatus, description: 'Subscription status' })
  @IsEnum(SubscriptionStatus)
  subscription_status: SubscriptionStatus;
}
