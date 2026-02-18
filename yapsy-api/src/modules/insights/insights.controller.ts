import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MobileApi, CurrentUser, RequiresPro } from '../../common/decorators';
import { JwtAuthGuard, SubscriptionGuard } from '../../common/guards';
import {
  MoodQueryDto,
  MoodDataPointDto,
  ThemeCountDto,
  StreaksResponseDto,
  MoodInsightResponseDto,
  ProductivityResponseDto,
} from './dto';
import { InsightsService } from './insights.service';

@Controller('api/v1/mobile/insights')
@MobileApi('Insights')
@UseGuards(JwtAuthGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('mood')
  @ApiOperation({ summary: 'Get mood data for the last N days' })
  @ApiResponse({
    status: 200,
    description: 'Mood data returned successfully',
    type: [MoodDataPointDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMoodData(@CurrentUser('id') userId: string, @Query() query: MoodQueryDto) {
    const days = query.days ?? 7;
    return this.insightsService.getMoodData(userId, days);
  }

  @Get('themes')
  @ApiOperation({ summary: 'Get top themes from last 30 days of journals' })
  @ApiResponse({
    status: 200,
    description: 'Themes returned successfully',
    type: [ThemeCountDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getThemes(@CurrentUser('id') userId: string) {
    return this.insightsService.getThemes(userId);
  }

  @Get('streaks')
  @ApiOperation({
    summary: 'Get streak data (current, longest, total check-ins)',
  })
  @ApiResponse({
    status: 200,
    description: 'Streaks returned successfully',
    type: StreaksResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getStreaks(@CurrentUser('id') userId: string) {
    return this.insightsService.getStreaks(userId);
  }

  @Get('weekly')
  @RequiresPro()
  @UseGuards(SubscriptionGuard)
  @ApiOperation({ summary: 'Get weekly AI insight (Pro only)' })
  @ApiResponse({
    status: 200,
    description: 'Weekly insight returned successfully',
    type: MoodInsightResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Pro subscription required' })
  getWeeklyInsight(@CurrentUser('id') userId: string) {
    return this.insightsService.getWeeklyInsight(userId);
  }

  @Get('productivity')
  @RequiresPro()
  @UseGuards(SubscriptionGuard)
  @ApiOperation({ summary: 'Get task productivity stats (Pro only)' })
  @ApiResponse({
    status: 200,
    description: 'Productivity stats returned successfully',
    type: ProductivityResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Pro subscription required' })
  getProductivity(@CurrentUser('id') userId: string) {
    return this.insightsService.getProductivity(userId);
  }
}
