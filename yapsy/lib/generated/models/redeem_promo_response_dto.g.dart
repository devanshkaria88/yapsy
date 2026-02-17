// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'redeem_promo_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RedeemPromoResponseDto _$RedeemPromoResponseDtoFromJson(
  Map<String, dynamic> json,
) => RedeemPromoResponseDto(
  redemption: UserPromoRedemptionResponseDto.fromJson(
    json['redemption'] as Map<String, dynamic>,
  ),
  discountAmount: json['discountAmount'] as num,
  finalPrice: json['finalPrice'] as num,
  effectiveUntil: DateTime.parse(json['effectiveUntil'] as String),
);

Map<String, dynamic> _$RedeemPromoResponseDtoToJson(
  RedeemPromoResponseDto instance,
) => <String, dynamic>{
  'redemption': instance.redemption,
  'discountAmount': instance.discountAmount,
  'finalPrice': instance.finalPrice,
  'effectiveUntil': instance.effectiveUntil.toIso8601String(),
};
