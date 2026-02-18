import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCode } from './entities/promo-code.entity';
import { UserPromoRedemption } from './entities/user-promo-redemption.entity';
import { PromoCodesService } from './promo-codes.service';
import { PromoCodesController } from './promo-codes.controller';
import { AdminPromoCodesController } from './admin-promo-codes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PromoCode, UserPromoRedemption])],
  controllers: [PromoCodesController, AdminPromoCodesController],
  providers: [PromoCodesService],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}
