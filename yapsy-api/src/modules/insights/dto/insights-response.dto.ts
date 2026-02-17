import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MoodTrend } from '../../../common/enums';

export class MoodDataPointDto {
  @ApiProperty({ example: '2026-02-15', format: 'date' })
  date: string;

  @ApiPropertyOptional({ nullable: true, example: 8 })
  mood_score: number | null;

  @ApiPropertyOptional({ nullable: true, example: 'happy' })
  mood_label: string | null;
}

export class ThemeCountDto {
  @ApiProperty({ example: 'work' })
  theme: string;

  @ApiProperty({ example: 5 })
  count: number;
}

export class StreaksResponseDto {
  @ApiProperty({ example: 7 })
  current_streak: number;

  @ApiProperty({ example: 14 })
  longest_streak: number;

  @ApiProperty({ example: 42 })
  total_check_ins: number;
}

export class MoodInsightResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  user_id: string;

  @ApiProperty({ format: 'date', example: '2026-02-10' })
  week_start: string;

  @ApiPropertyOptional({ nullable: true, example: 7.5 })
  avg_mood: number | null;

  @ApiPropertyOptional({ nullable: true, enum: MoodTrend })
  mood_trend: MoodTrend | null;

  @ApiProperty({ type: [String], example: ['work', 'health', 'family'] })
  top_themes: string[];

  @ApiPropertyOptional({ nullable: true, example: 85 })
  productivity_score: number | null;

  @ApiPropertyOptional({ nullable: true, example: 'This week you showed improvement in...' })
  insight_text: string | null;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;
}

export class ProductivityPeriodDto {
  @ApiProperty({ example: 8 })
  completed: number;

  @ApiProperty({ example: 10 })
  total: number;

  @ApiProperty({ example: 80, description: 'Completion rate percentage' })
  rate: number;
}

export class ProductivityResponseDto {
  @ApiProperty({ type: ProductivityPeriodDto })
  week: ProductivityPeriodDto;

  @ApiProperty({ type: ProductivityPeriodDto })
  two_weeks: ProductivityPeriodDto;

  @ApiProperty({ type: ProductivityPeriodDto })
  month: ProductivityPeriodDto;
}
