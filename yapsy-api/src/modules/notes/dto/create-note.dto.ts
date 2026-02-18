import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'Note content',
    example: 'Call dentist tomorrow',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    description: 'Follow-up date',
    example: '2026-02-20',
    type: String,
  })
  @IsDateString()
  @IsOptional()
  follow_up_date?: string;

  @ApiPropertyOptional({
    description: 'Note source',
    enum: ['voice', 'manual'],
    default: 'manual',
  })
  @IsString()
  @IsOptional()
  source?: string = 'manual';
}
