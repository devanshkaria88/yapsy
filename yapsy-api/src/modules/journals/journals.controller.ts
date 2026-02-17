import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { MobileApi, CurrentUser, RequiresPro } from '../../common/decorators';
import { JwtAuthGuard, SubscriptionGuard } from '../../common/guards';
import {
  JournalQueryDto,
  JournalSearchDto,
  JournalStatsQueryDto,
  JournalResponseDto,
  JournalStatsResponseDto,
} from './dto';
import { JournalsService } from './journals.service';

@Controller('api/v1/mobile/journals')
@MobileApi('Journals')
@UseGuards(JwtAuthGuard)
@ApiExtraModels(JournalResponseDto)
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all journals with pagination and date filters' })
  @ApiResponse({
    status: 200,
    description: 'Journals returned successfully',
    schema: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(JournalResponseDto) } },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            total: { type: 'number', example: 42 },
            hasMore: { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @CurrentUser('id') userId: string,
    @Query() query: JournalQueryDto,
  ) {
    return this.journalsService.findAll(userId, query);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get journal for today' })
  @ApiResponse({ status: 200, description: "Today's journal returned", type: JournalResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findToday(@CurrentUser('id') userId: string) {
    return this.journalsService.findToday(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get journal stats for last N days' })
  @ApiResponse({ status: 200, description: 'Stats returned successfully', type: JournalStatsResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findStats(
    @CurrentUser('id') userId: string,
    @Query() query: JournalStatsQueryDto,
  ) {
    const days = query.days ?? 30;
    return this.journalsService.findStats(userId, days);
  }

  @Get('search')
  @RequiresPro()
  @UseGuards(SubscriptionGuard)
  @ApiOperation({ summary: 'Search journals by keyword (Pro only)' })
  @ApiResponse({
    status: 200,
    description: 'Search results returned',
    schema: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(JournalResponseDto) } },
        meta: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            total: { type: 'number', example: 42 },
            hasMore: { type: 'boolean', example: true },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Pro subscription required' })
  search(
    @CurrentUser('id') userId: string,
    @Query() query: JournalSearchDto,
  ) {
    return this.journalsService.search(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a journal by ID' })
  @ApiParam({ name: 'id', description: 'Journal ID' })
  @ApiResponse({ status: 200, description: 'Journal returned successfully', type: JournalResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Journal not found' })
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id') journalId: string,
  ) {
    return this.journalsService.findOne(userId, journalId);
  }
}
