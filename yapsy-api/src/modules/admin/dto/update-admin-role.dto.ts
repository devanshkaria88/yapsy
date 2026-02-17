import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AdminRole } from '../../../common/enums';

export class UpdateAdminRoleDto {
  @ApiProperty({ description: 'New admin role', enum: AdminRole })
  @IsEnum(AdminRole)
  role: AdminRole;
}
