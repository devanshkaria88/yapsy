import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../../../common/enums';

export class TaskResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  user_id: string;

  @ApiProperty({ example: 'Buy groceries' })
  title: string;

  @ApiPropertyOptional({ example: 'Milk, eggs, bread', nullable: true })
  description: string | null;

  @ApiProperty({ example: '2026-02-15', format: 'date' })
  scheduled_date: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  rolled_from_id: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'date-time' })
  completed_at: Date | null;

  @ApiPropertyOptional({ nullable: true, example: 'voice' })
  source: string | null;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;

  @ApiProperty({ format: 'date-time' })
  updated_at: Date;
}

export class TaskPaginationMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  limit: number;

  @ApiProperty({ example: 42 })
  total: number;

  @ApiProperty({ example: true })
  hasMore: boolean;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Task deleted' })
  message: string;
}
