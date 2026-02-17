import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class MoodQueryDto {
  @ApiPropertyOptional({
    description: 'Number of days for mood data',
    default: 7,
    enum: [7, 14, 30],
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([7, 14, 30])
  days?: number = 7;
}
