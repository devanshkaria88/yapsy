// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'user_promo_redemption_response_dto.g.dart';

@JsonSerializable()
class UserPromoRedemptionResponseDto {
  const UserPromoRedemptionResponseDto({
    required this.id,
    required this.userId,
    required this.promoCodeId,
    required this.redeemedAt,
    this.effectiveUntil,
  });
  
  factory UserPromoRedemptionResponseDto.fromJson(Map<String, Object?> json) => _$UserPromoRedemptionResponseDtoFromJson(json);
  
  final String id;
  @JsonKey(name: 'user_id')
  final String userId;
  @JsonKey(name: 'promo_code_id')
  final String promoCodeId;
  @JsonKey(name: 'redeemed_at')
  final DateTime redeemedAt;
  @JsonKey(name: 'effective_until')
  final dynamic effectiveUntil;

  Map<String, Object?> toJson() => _$UserPromoRedemptionResponseDtoToJson(this);
}
