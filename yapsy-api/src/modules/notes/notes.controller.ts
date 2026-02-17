import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { MobileApi, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';
import { CreateNoteDto, NoteQueryDto, UpdateNoteDto, NoteResponseDto } from './dto';
import { MessageResponseDto } from '../../common/dto/message-response.dto';
import { NotesService } from './notes.service';

@Controller('api/v1/mobile/notes')
@MobileApi('Notes')
@UseGuards(JwtAuthGuard)
@ApiExtraModels(NoteResponseDto)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all notes with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Notes returned successfully',
    schema: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(NoteResponseDto) } },
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
    @Query() query: NoteQueryDto,
  ) {
    return this.notesService.findAll(userId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'Note created successfully', type: NoteResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(userId, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note updated successfully', type: NoteResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') noteId: string,
    @Body() dto: UpdateNoteDto,
  ) {
    return this.notesService.update(userId, noteId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'Note ID' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') noteId: string,
  ) {
    await this.notesService.remove(userId, noteId);
    return { message: 'Note deleted' };
  }
}
