import { ApiProperty } from '@nestjs/swagger';

export class PrepareSessionResponseDto {
  @ApiProperty({ example: 'https://api.elevenlabs.io/v1/...' })
  signed_url: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    example: { agent_id: 'abc123' },
  })
  session_config: Record<string, unknown>;
}

export class ProcessingStatusResponseDto {
  @ApiProperty({ example: 'completed', enum: ['pending', 'processing', 'completed', 'failed'] })
  processing_status: string;
}
