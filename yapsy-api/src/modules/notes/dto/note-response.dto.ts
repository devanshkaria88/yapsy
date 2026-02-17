import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  user_id: string;

  @ApiProperty({ example: 'Remember to follow up on the meeting' })
  content: string;

  @ApiPropertyOptional({ nullable: true, format: 'date', example: '2026-02-20' })
  follow_up_date: string | null;

  @ApiProperty({ example: false })
  is_resolved: boolean;

  @ApiPropertyOptional({ nullable: true, example: 'voice' })
  source: string | null;

  @ApiPropertyOptional({ nullable: true, format: 'uuid' })
  journal_id: string | null;

  @ApiProperty({ format: 'date-time' })
  created_at: Date;

  @ApiProperty({ format: 'date-time' })
  updated_at: Date;
}
