import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { SubscriptionStatus } from '../../../common/enums';

export class AdminUserQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search by email or name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: SubscriptionStatus,
    description: 'Filter by subscription status',
  })
  @IsOptional()
  @IsEnum(SubscriptionStatus)
  subscription_status?: SubscriptionStatus;

  @ApiPropertyOptional({ default: 'created_at', description: 'Sort field' })
  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    description: 'Sort order',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sort_order?: 'ASC' | 'DESC' = 'DESC';
}
