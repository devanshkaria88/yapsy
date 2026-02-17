// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_promo_redemption_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserPromoRedemptionResponseDto _$UserPromoRedemptionResponseDtoFromJson(
  Map<String, dynamic> json,
) => UserPromoRedemptionResponseDto(
  id: json['id'] as String,
  userId: json['user_id'] as String,
  promoCodeId: json['promo_code_id'] as String,
  redeemedAt: DateTime.parse(json['redeemed_at'] as String),
  effectiveUntil: json['effective_until'],
);

Map<String, dynamic> _$UserPromoRedemptionResponseDtoToJson(
  UserPromoRedemptionResponseDto instance,
) => <String, dynamic>{
  'id': instance.id,
  'user_id': instance.userId,
  'promo_code_id': instance.promoCodeId,
  'redeemed_at': instance.redeemedAt.toIso8601String(),
  'effective_until': instance.effectiveUntil,
};
