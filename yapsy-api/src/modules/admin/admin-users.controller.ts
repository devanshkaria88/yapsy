import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminApi, CurrentUser } from '../../common/decorators';
import { AdminJwtAuthGuard, SuperAdminGuard } from '../../common/guards';
import { AdminUser } from '../users/entities/admin-user.entity';
import { AdminUsersService } from './admin-users.service';
import { CreateAdminDto, UpdateAdminRoleDto } from './dto';

@Controller('api/v1/admin/admins')
@ApiTags('Admin Users Management')
@AdminApi('Admin Users Management')
@UseGuards(AdminJwtAuthGuard, SuperAdminGuard)
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all admin users' })
  @ApiResponse({ status: 200, description: 'Admin users returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Super admin access required' })
  findAll() {
    return this.adminUsersService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new admin user',
    description:
      'Creates a new admin record. The email must match a Firebase account so the admin can log in.',
  })
  @ApiResponse({ status: 201, description: 'Admin user created' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  create(@Body() dto: CreateAdminDto) {
    return this.adminUsersService.create(dto);
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update an admin user role' })
  @ApiResponse({ status: 200, description: 'Role updated' })
  @ApiResponse({ status: 403, description: 'Cannot change own role' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAdminRoleDto,
    @CurrentUser() currentAdmin: AdminUser,
  ) {
    return this.adminUsersService.updateRole(id, dto, currentAdmin.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an admin user' })
  @ApiResponse({ status: 200, description: 'Admin deleted' })
  @ApiResponse({ status: 403, description: 'Cannot delete yourself' })
  @ApiResponse({ status: 404, description: 'Admin not found' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentAdmin: AdminUser,
  ) {
    await this.adminUsersService.remove(id, currentAdmin.id);
    return { message: 'Admin user deleted' };
  }
}
