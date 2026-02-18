import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AdminApi } from '../../common/decorators';
import { AdminJwtAuthGuard, SuperAdminGuard } from '../../common/guards';
import { AdminUserQueryDto, UpdateSubscriptionDto } from './dto';
import { UsersService } from './users.service';

@Controller('api/v1/admin/users')
@AdminApi('Admin Users')
@UseGuards(AdminJwtAuthGuard)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() query: AdminUserQueryDto) {
    return this.usersService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'User details returned successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOneAdmin(id);
  }

  @Patch(':id/subscription')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({
    summary: 'Update user subscription status (Super Admin only)',
  })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({
    status: 200,
    description: 'Subscription updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  updateSubscription(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.usersService.updateSubscriptionStatus(id, dto);
  }
}
