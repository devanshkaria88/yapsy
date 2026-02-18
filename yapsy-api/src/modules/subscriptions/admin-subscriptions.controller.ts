import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AdminApi } from '../../common/decorators';
import { AdminJwtAuthGuard, SuperAdminGuard } from '../../common/guards';
import { CreatePlanDto, UpdatePlanDto } from './dto';
import { SubscriptionsService } from './subscriptions.service';

@Controller('api/v1/admin/subscriptions')
@AdminApi('Admin Subscriptions')
@UseGuards(AdminJwtAuthGuard)
export class AdminSubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all plans including inactive' })
  @ApiResponse({ status: 200, description: 'List of all plans' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getPlansAdmin() {
    return this.subscriptionsService.getPlansAdmin();
  }

  @Post('plans')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Create a new plan (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Plan created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin required' })
  createPlan(@Body() dto: CreatePlanDto) {
    return this.subscriptionsService.createPlan(dto);
  }

  @Patch('plans/:id')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Update a plan (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'Plan UUID' })
  @ApiResponse({ status: 200, description: 'Plan updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin required' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  updatePlan(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.subscriptionsService.updatePlan(id, dto);
  }

  @Delete('plans/:id')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Deactivate a plan (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'Plan UUID' })
  @ApiResponse({ status: 200, description: 'Plan deactivated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin required' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  deactivatePlan(@Param('id') id: string) {
    return this.subscriptionsService.deactivatePlan(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get subscription statistics' })
  @ApiResponse({
    status: 200,
    description: 'Subscription stats (total pro, free, MRR)',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getStats() {
    return this.subscriptionsService.getStats();
  }
}
