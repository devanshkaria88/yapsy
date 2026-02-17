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
import { ParseIntPipe } from '@nestjs/common/pipes';
import { MobileApi, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';
import {
  CreateTaskDto,
  RolloverTaskDto,
  TaskQueryDto,
  UpdateTaskDto,
  TaskResponseDto,
  MessageResponseDto,
} from './dto';
import { TasksService } from './tasks.service';

@Controller('api/v1/mobile/tasks')
@MobileApi('Tasks')
@UseGuards(JwtAuthGuard)
@ApiExtraModels(TaskResponseDto)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 200, description: 'Task created successfully', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with pagination and filters' })
  @ApiResponse({
    status: 200,
    description: 'Tasks returned successfully',
    schema: {
      type: 'object',
      properties: {
        items: { type: 'array', items: { $ref: getSchemaPath(TaskResponseDto) } },
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
    @Query() query: TaskQueryDto,
  ) {
    return this.tasksService.findAll(userId, query);
  }

  @Get('today')
  @ApiOperation({ summary: 'Get tasks for today' })
  @ApiResponse({ status: 200, description: "Today's tasks returned successfully", type: [TaskResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findToday(@CurrentUser('id') userId: string) {
    return this.tasksService.findToday(userId);
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Get overdue pending tasks' })
  @ApiResponse({ status: 200, description: 'Overdue tasks returned successfully', type: [TaskResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOverdue(@CurrentUser('id') userId: string) {
    return this.tasksService.findOverdue(userId);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming tasks (next 14 days)' })
  @ApiResponse({ status: 200, description: 'Upcoming tasks returned successfully', type: [TaskResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findUpcoming(@CurrentUser('id') userId: string) {
    return this.tasksService.findUpcoming(userId);
  }

  @Get('calendar/:year/:month')
  @ApiOperation({ summary: 'Get tasks for a calendar month' })
  @ApiParam({ name: 'year', description: 'Year (e.g. 2026)' })
  @ApiParam({ name: 'month', description: 'Month (1-12)' })
  @ApiResponse({ status: 200, description: 'Calendar tasks returned successfully', type: [TaskResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findCalendarMonth(
    @CurrentUser('id') userId: string,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
  ) {
    return this.tasksService.findCalendarMonth(userId, year, month);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task returned successfully', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    return this.tasksService.findOne(userId, taskId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(userId, taskId, dto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Mark a task as completed' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task completed successfully', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  complete(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    return this.tasksService.complete(userId, taskId);
  }

  @Post(':id/rollover')
  @ApiOperation({ summary: 'Roll over a task to a new date' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task rolled over successfully', type: TaskResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  rollover(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
    @Body() dto: RolloverTaskDto,
  ) {
    return this.tasksService.rollover(userId, taskId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (soft delete)' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('id') taskId: string,
  ) {
    await this.tasksService.remove(userId, taskId);
    return { message: 'Task deleted' };
  }
}
