import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty({ description: 'Razorpay payment ID' })
  @IsString()
  razorpay_payment_id: string;

  @ApiProperty({ description: 'Razorpay subscription ID' })
  @IsString()
  razorpay_subscription_id: string;

  @ApiProperty({ description: 'Razorpay signature for verification' })
  @IsString()
  razorpay_signature: string;
}
