import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskPriority } from '../../../common/enums';

export class CreateTaskDto {
  @ApiProperty({ description: 'Task title', example: 'Buy groceries' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: 'Task description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Scheduled date',
    example: '2026-02-20',
    type: String,
  })
  @IsDateString()
  scheduled_date: string;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority = TaskPriority.MEDIUM;

  @ApiPropertyOptional({ description: 'Task source', default: 'manual' })
  @IsString()
  @IsOptional()
  source?: string = 'manual';
}
