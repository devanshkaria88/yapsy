// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/redeem_promo_dto.dart';
import '../models/redeem_promo_response_dto.dart';
import '../models/validate_promo_response_dto.dart';

part 'promo_client.g.dart';

@RestApi()
abstract class PromoClient {
  factory PromoClient(Dio dio, {String? baseUrl}) = _PromoClient;

  /// Validate a promo code.
  ///
  /// [code] - Promo code to validate.
  ///
  /// [originalPrice] - Original price in paise for discount calculation preview.
  @GET('/api/v1/mobile/promo/validate/{code}')
  Future<ValidatePromoResponseDto> mobilePromoCodesControllerValidate({
    @Path('code') required String code,
    @Query('originalPrice') String? originalPrice,
  });

  /// Redeem a promo code
  @POST('/api/v1/mobile/promo/redeem')
  Future<RedeemPromoResponseDto> mobilePromoCodesControllerRedeem({
    @Query('originalPrice') required String originalPrice,
    @Body() required RedeemPromoDto body,
  });
}
