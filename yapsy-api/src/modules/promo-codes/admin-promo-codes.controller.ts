import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AdminApi } from '../../common/decorators';
import { AdminJwtAuthGuard } from '../../common/guards';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CreatePromoDto, UpdatePromoDto } from './dto';
import { PromoCodesService } from './promo-codes.service';
import { PromoCode } from './entities/promo-code.entity';
import { UserPromoRedemption } from './entities/user-promo-redemption.entity';

@Controller('api/v1/admin/promo-codes')
@AdminApi('Admin Promo Codes')
@UseGuards(AdminJwtAuthGuard)
export class AdminPromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Get()
  @ApiOperation({ summary: 'List all promo codes with pagination' })
  @ApiResponse({ status: 200, description: 'Paginated list of promo codes' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() query: PaginationDto) {
    return this.promoCodesService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new promo code' })
  @ApiResponse({ status: 201, description: 'Promo code created successfully' })
  @ApiResponse({
    status: 400,
    description: 'Validation error or code already exists',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreatePromoDto): Promise<PromoCode> {
    return this.promoCodesService.create(dto);
  }

  @Get(':id/redemptions')
  @ApiOperation({ summary: 'Get redemptions for a promo code' })
  @ApiParam({ name: 'id', description: 'Promo code UUID' })
  @ApiResponse({
    status: 200,
    description: 'List of redemptions with user info',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  getRedemptions(@Param('id') id: string): Promise<UserPromoRedemption[]> {
    return this.promoCodesService.getRedemptions(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a promo code' })
  @ApiParam({ name: 'id', description: 'Promo code UUID' })
  @ApiResponse({ status: 200, description: 'Promo code updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePromoDto,
  ): Promise<PromoCode> {
    return this.promoCodesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a promo code' })
  @ApiParam({ name: 'id', description: 'Promo code UUID' })
  @ApiResponse({
    status: 200,
    description: 'Promo code deactivated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Promo code not found' })
  async deactivate(@Param('id') id: string): Promise<{ message: string }> {
    await this.promoCodesService.deactivate(id);
    return { message: 'Promo code deactivated' };
  }
}
