// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'user_promo_redemption_response_dto.dart';

part 'redeem_promo_response_dto.g.dart';

@JsonSerializable()
class RedeemPromoResponseDto {
  const RedeemPromoResponseDto({
    required this.redemption,
    required this.discountAmount,
    required this.finalPrice,
    required this.effectiveUntil,
  });
  
  factory RedeemPromoResponseDto.fromJson(Map<String, Object?> json) => _$RedeemPromoResponseDtoFromJson(json);
  
  final UserPromoRedemptionResponseDto redemption;
  final num discountAmount;
  final num finalPrice;
  final DateTime effectiveUntil;

  Map<String, Object?> toJson() => _$RedeemPromoResponseDtoToJson(this);
}
