import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TranscriptMessageDto {
  @ApiProperty({ description: 'Role (user/assistant)', example: 'user' })
  @IsString()
  role: string;

  @ApiProperty({ description: 'Message text', example: 'Hello' })
  @IsString()
  text: string;

  @ApiProperty({ description: 'Timestamp in seconds', example: 0 })
  @IsNumber()
  timestamp: number;
}

export class SaveConversationDto {
  @ApiProperty({
    description: 'ElevenLabs conversation ID',
    example: 'conv_abc123',
  })
  @IsString()
  @IsNotEmpty()
  conversation_id: string;

  @ApiProperty({
    description: 'Transcript array',
    type: [TranscriptMessageDto],
    example: [
      { role: 'user', text: 'Hello', timestamp: 0 },
      { role: 'assistant', text: 'Hi there!', timestamp: 1 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranscriptMessageDto)
  transcript: TranscriptMessageDto[];

  @ApiProperty({
    description: 'Duration in seconds',
    example: 120,
  })
  @IsNumber()
  duration_seconds: number;

  @ApiPropertyOptional({
    description: 'Date of conversation (defaults to today)',
    example: '2026-02-15',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
