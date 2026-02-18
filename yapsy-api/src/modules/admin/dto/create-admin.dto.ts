import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AdminRole } from '../../../common/enums';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Admin email (must match a Firebase account)',
    example: 'admin@yapsy.app',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Display name', example: 'Jane Doe' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiPropertyOptional({
    description: 'Admin role',
    enum: AdminRole,
    default: AdminRole.MODERATOR,
  })
  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole = AdminRole.MODERATOR;
}
