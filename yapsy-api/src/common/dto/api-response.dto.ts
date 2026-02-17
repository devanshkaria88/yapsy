import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ description: 'Response data' })
  data: T;

  @ApiPropertyOptional({ description: 'Pagination or other metadata' })
  meta?: Record<string, unknown>;
}

export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({
    type: 'object',
    properties: {
      code: { type: 'string', example: 'BAD_REQUEST' },
      message: { type: 'string', example: 'Validation failed' },
      statusCode: { type: 'number', example: 400 },
    },
  })
  error: {
    code: string;
    message: string;
    statusCode: number;
  };
}
