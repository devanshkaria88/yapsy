import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class NoteQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Filter by resolved status' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  is_resolved?: boolean;

  @ApiPropertyOptional({ description: 'Filter by source', enum: ['voice', 'manual'] })
  @IsString()
  @IsOptional()
  source?: string;
}
