import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminApi } from '../../common/decorators';
import { AdminJwtAuthGuard } from '../../common/guards';
import { DashboardService } from './dashboard.service';

@Controller('api/v1/admin/dashboard')
@ApiTags('Admin Dashboard')
@AdminApi('Admin Dashboard')
@UseGuards(AdminJwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get dashboard overview metrics' })
  @ApiResponse({ status: 200, description: 'Overview metrics returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('growth')
  @ApiOperation({ summary: 'Get user registration growth over time' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to look back (default: 30)',
  })
  @ApiResponse({ status: 200, description: 'Growth data by date' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getGrowth(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.dashboardService.getGrowth(daysNum);
  }

  @Get('check-ins')
  @ApiOperation({ summary: 'Get check-ins per day' })
  @ApiQuery({
    name: 'days',
    required: false,
    type: Number,
    description: 'Number of days to look back (default: 30)',
  })
  @ApiResponse({ status: 200, description: 'Check-ins data by date' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCheckIns(@Query('days') days?: string) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return this.dashboardService.getCheckIns(daysNum);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue and subscriber metrics' })
  @ApiResponse({ status: 200, description: 'Revenue and plan breakdown' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getRevenue() {
    return this.dashboardService.getRevenue();
  }
}
