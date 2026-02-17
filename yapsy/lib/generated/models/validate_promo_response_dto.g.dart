// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'validate_promo_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ValidatePromoResponseDto _$ValidatePromoResponseDtoFromJson(
  Map<String, dynamic> json,
) => ValidatePromoResponseDto(
  promo: PromoCodeResponseDto.fromJson(json['promo'] as Map<String, dynamic>),
  discountAmount: json['discountAmount'] as num,
  finalPrice: json['finalPrice'] as num,
);

Map<String, dynamic> _$ValidatePromoResponseDtoToJson(
  ValidatePromoResponseDto instance,
) => <String, dynamic>{
  'promo': instance.promo,
  'discountAmount': instance.discountAmount,
  'finalPrice': instance.finalPrice,
};
