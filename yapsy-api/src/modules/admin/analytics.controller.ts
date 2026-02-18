import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminApi } from '../../common/decorators';
import { AdminJwtAuthGuard } from '../../common/guards';
import { AnalyticsService } from './analytics.service';

@Controller('api/v1/admin/analytics')
@ApiTags('Admin Analytics')
@AdminApi('Admin Analytics')
@UseGuards(AdminJwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('mood-distribution')
  @ApiOperation({ summary: 'Get mood score distribution (low/medium/high)' })
  @ApiResponse({ status: 200, description: 'Mood distribution returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMoodDistribution() {
    return this.analyticsService.getMoodDistribution();
  }

  @Get('retention')
  @ApiOperation({ summary: 'Get cohort retention metrics' })
  @ApiQuery({
    name: 'months',
    required: false,
    type: Number,
    description: 'Number of cohort months to analyze (default: 6)',
  })
  @ApiResponse({ status: 200, description: 'Retention data by cohort' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getRetention(@Query('months') months?: string) {
    const monthsNum = months ? parseInt(months, 10) : 6;
    return this.analyticsService.getRetention(monthsNum);
  }

  @Get('feature-usage')
  @ApiOperation({ summary: 'Get feature usage statistics' })
  @ApiResponse({ status: 200, description: 'Feature usage stats returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getFeatureUsage() {
    return this.analyticsService.getFeatureUsage();
  }

  @Get('conversion-funnel')
  @ApiOperation({ summary: 'Get conversion funnel metrics' })
  @ApiResponse({ status: 200, description: 'Conversion funnel returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getConversionFunnel() {
    return this.analyticsService.getConversionFunnel();
  }

  @Get('themes')
  @ApiOperation({ summary: 'Get top themes from journals' })
  @ApiResponse({ status: 200, description: 'Top 20 themes with counts' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getThemes() {
    return this.analyticsService.getThemes();
  }
}
