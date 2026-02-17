import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class RolloverTaskDto {
  @ApiProperty({ description: 'New date for the rolled-over task', example: '2026-02-21', type: String })
  @IsDateString()
  @IsNotEmpty()
  new_date: string;
}
