import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateNoteDto {
  @ApiPropertyOptional({ description: 'Note content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Follow-up date',
    example: '2026-02-20',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  follow_up_date?: string;

  @ApiPropertyOptional({ description: 'Whether the note is resolved' })
  @IsBoolean()
  @IsOptional()
  is_resolved?: boolean;
}
