import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWaitlistEntryDto {
  @ApiProperty({ description: 'Email address', example: 'user@example.com' })
  @IsEmail()
  @Transform(({ value }: { value: unknown }): string =>
    typeof value === 'string' ? value.trim().toLowerCase() : String(value),
  )
  email: string;

  @ApiPropertyOptional({
    description: 'Country code (ISO 3166-1 alpha-2)',
    example: 'GB',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'UTM source' })
  @IsOptional()
  @IsString()
  utm_source?: string;

  @ApiPropertyOptional({ description: 'UTM medium' })
  @IsOptional()
  @IsString()
  utm_medium?: string;

  @ApiPropertyOptional({ description: 'UTM campaign' })
  @IsOptional()
  @IsString()
  utm_campaign?: string;
}
