import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../../common/enums';

export class OnboardingDto {
  @ApiProperty({ description: 'User display name', example: 'Devansh' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Date of birth (YYYY-MM-DD)',
    example: '1998-05-15',
    type: String,
  })
  @IsDateString()
  date_of_birth: string;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({
    description: 'User timezone',
    example: 'Asia/Kolkata',
  })
  @IsString()
  @IsOptional()
  timezone?: string;
}
