import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../../common/enums';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class TaskQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by specific date',
    example: '2026-02-20',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'Start date for range filter',
    example: '2026-02-01',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({
    description: 'End date for range filter',
    example: '2026-02-28',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  to?: string;

  @ApiPropertyOptional({ enum: TaskPriority })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}
