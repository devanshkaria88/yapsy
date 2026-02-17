import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateFcmTokenDto {
  @ApiProperty({ description: 'Firebase Cloud Messaging token for push notifications' })
  @IsString()
  @IsNotEmpty()
  fcm_token: string;
}
