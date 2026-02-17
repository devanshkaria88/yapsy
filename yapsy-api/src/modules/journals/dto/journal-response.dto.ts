import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConcernLevel } from '../../../common/enums';

export class JournalResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  user_id: string;

  @ApiProperty({ example: '2026-02-15', format: 'date' })
  date: string;

  @ApiPropertyOptional({ nullable: true })
  elevenlabs_conversation_id: string | null;

  @ApiProperty({ example: 120 })
  duration_seconds: number;

  @ApiProperty({ type: 'array', items: { type: 'object' }, example: [] })
  transcript: unknown[];

  @ApiPropertyOptional({ nullable: true, example: 'Had a productive day...' })
  summary: string | null;

  @ApiPropertyOptional({ nullable: true, example: 8 })
  mood_score: number | null;

  @ApiPropertyOptional({ nullable: true, example: 'happy' })
  mood_label: string | null;

  @ApiProperty({ type: [String], example: ['work', 'health'] })
  themes: string[];

  @ApiProperty({ type: [String], example: ['Finished project'] })
  wins: string[];

  @ApiProperty({ type: [String], example: ['Felt tired'] })
  struggles: string[];

  @ApiProperty({ type: [String], example: ['John'] })
  people_mentioned: string[];

  @ApiProperty({ enum: ConcernLevel, example: ConcernLevel.LOW })
  concern_level: ConcernLevel;

  @ApiProperty({ type: 'array', items: { type: 'object' }, example: [] })
  actions_taken: unknown[];

  @ApiProperty({ example: 'completed' })
  processing_status: string;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;

  @ApiProperty({ format: 'date-time' })
  updated_at: Date;
}

export class JournalStatsResponseDto {
  @ApiProperty({ type: [JournalResponseDto] })
  entries: JournalResponseDto[];

  @ApiProperty({ example: 7.5 })
  avg_mood: number;

  @ApiProperty({ example: 15 })
  total_entries: number;
}
