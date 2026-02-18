import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class RedeemPromoDto {
  @ApiProperty({ description: 'Promo code to redeem', example: 'SAVE20' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }): string =>
    typeof value === 'string' ? value.toUpperCase() : String(value),
  )
  code: string;
}
