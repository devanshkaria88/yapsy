import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminApi } from '../../common/decorators';
import { AdminJwtAuthGuard, SuperAdminGuard } from '../../common/guards';
import { SystemService } from './system.service';

@Controller('api/v1/admin/system')
@ApiTags('Admin System')
@AdminApi('Admin System')
@UseGuards(AdminJwtAuthGuard)
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({ status: 200, description: 'Health status returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getHealth() {
    return this.systemService.getHealth();
  }

  @Get('costs')
  @ApiOperation({ summary: 'Get API cost tracking (placeholder)' })
  @ApiResponse({ status: 200, description: 'Cost breakdown returned' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCosts() {
    return this.systemService.getCosts();
  }

  @Get('errors')
  @ApiOperation({ summary: 'Get recent failed webhook events' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Max number of events to return (default: 50)',
  })
  @ApiResponse({ status: 200, description: 'List of error webhook events' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getErrors(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.systemService.getErrors(limitNum);
  }

  @Get('webhooks')
  @ApiOperation({ summary: 'Get recent webhook events' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Max number of events to return (default: 50)',
  })
  @ApiResponse({ status: 200, description: 'List of webhook events' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getWebhooks(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.systemService.getWebhooks(limitNum);
  }

  @Post('webhooks/:id/retry')
  @UseGuards(SuperAdminGuard)
  @ApiOperation({ summary: 'Retry a failed webhook event (Super Admin only)' })
  @ApiParam({ name: 'id', description: 'Webhook event UUID' })
  @ApiResponse({ status: 200, description: 'Webhook reprocessed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin required' })
  @ApiResponse({ status: 404, description: 'Webhook event not found' })
  retryWebhook(@Param('id') id: string) {
    return this.systemService.retryWebhook(id);
  }
}
