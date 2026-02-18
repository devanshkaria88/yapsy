import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { MobileApi, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';
import {
  SaveConversationDto,
  PrepareSessionResponseDto,
  ProcessingStatusResponseDto,
} from './dto';
import { JournalResponseDto } from '../journals/dto';
import { ConversationsService } from './conversations.service';

@Controller('api/v1/mobile/conversations')
@MobileApi('Conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('prepare')
  @ApiOperation({ summary: 'Prepare a voice session (signed URL + config)' })
  @ApiResponse({
    status: 200,
    description: 'Session prepared successfully',
    type: PrepareSessionResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 402, description: 'Weekly limit reached (free tier)' })
  prepare(@CurrentUser('id') userId: string) {
    return this.conversationsService.prepareSession(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Save a conversation and create journal entry' })
  @ApiResponse({
    status: 201,
    description: 'Conversation saved, journal created',
    type: JournalResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  saveConversation(
    @CurrentUser('id') userId: string,
    @Body() dto: SaveConversationDto,
  ) {
    return this.conversationsService.saveConversation(userId, dto);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get journal processing status' })
  @ApiParam({ name: 'id', description: 'Journal ID' })
  @ApiResponse({
    status: 200,
    description: 'Processing status returned',
    type: ProcessingStatusResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Journal not found' })
  getProcessingStatus(
    @CurrentUser('id') userId: string,
    @Param('id') journalId: string,
  ) {
    return this.conversationsService.getProcessingStatus(userId, journalId);
  }
}
