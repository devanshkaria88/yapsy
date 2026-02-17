import { ApiProperty } from '@nestjs/swagger';
import { Gender, SubscriptionStatus } from '../../../common/enums';

export class AuthUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ nullable: true })
  name: string | null;

  @ApiProperty({ nullable: true })
  avatar_url: string | null;

  @ApiProperty({ enum: SubscriptionStatus })
  subscription_status: SubscriptionStatus;

  @ApiProperty({ description: 'Whether the user has completed onboarding' })
  is_onboarded: boolean;

  @ApiProperty({ nullable: true, enum: Gender })
  gender: Gender | null;

  @ApiProperty({ nullable: true })
  date_of_birth: string | null;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refresh_token: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}

export class AdminAuthResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  @ApiProperty()
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
