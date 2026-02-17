import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class JournalSearchDto extends PaginationDto {
  @ApiProperty({
    description: 'Search keyword',
    example: 'work',
  })
  @IsString()
  @IsNotEmpty()
  q: string;

  @ApiPropertyOptional({
    description: 'Filter by theme',
    example: 'productivity',
  })
  @IsOptional()
  @IsString()
  theme?: string;
}
