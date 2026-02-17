import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class JournalQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter from date',
    example: '2026-02-01',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({
    description: 'Filter to date',
    example: '2026-02-15',
  })
  @IsOptional()
  @IsDateString()
  to?: string;
}
