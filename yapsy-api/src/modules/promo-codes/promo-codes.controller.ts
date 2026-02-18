import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { MobileApi, CurrentUser } from '../../common/decorators';
import { JwtAuthGuard } from '../../common/guards';
import {
  RedeemPromoDto,
  ValidatePromoResponseDto,
  RedeemPromoResponseDto,
} from './dto';
import { PromoCodesService } from './promo-codes.service';

@Controller('api/v1/mobile/promo')
@MobileApi('Promo')
@UseGuards(JwtAuthGuard)
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Get('validate/:code')
  @ApiOperation({ summary: 'Validate a promo code' })
  @ApiParam({ name: 'code', description: 'Promo code to validate' })
  @ApiQuery({
    name: 'originalPrice',
    required: false,
    description: 'Original price in paise for discount calculation preview',
  })
  @ApiResponse({
    status: 200,
    description: 'Promo code is valid with discount info',
    type: ValidatePromoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Promo expired, inactive, or max uses reached',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  validate(
    @Param('code') code: string,
    @Query('originalPrice') originalPrice?: string,
  ) {
    const price = originalPrice ? parseInt(originalPrice, 10) : 0;
    return this.promoCodesService.validate(code, isNaN(price) ? 0 : price);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem a promo code' })
  @ApiResponse({
    status: 201,
    description: 'Promo code redeemed successfully',
    type: RedeemPromoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Promo invalid, expired, or max uses reached',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  @ApiResponse({ status: 409, description: 'Promo already redeemed by user' })
  redeem(
    @CurrentUser('id') userId: string,
    @Body() dto: RedeemPromoDto,
    @Query('originalPrice') originalPrice?: string,
  ) {
    const price = originalPrice ? parseInt(originalPrice, 10) : 0;
    return this.promoCodesService.redeem(
      userId,
      dto.code,
      isNaN(price) ? 0 : price,
    );
  }
}
