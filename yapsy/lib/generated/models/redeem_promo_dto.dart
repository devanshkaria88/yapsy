// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'redeem_promo_dto.g.dart';

@JsonSerializable()
class RedeemPromoDto {
  const RedeemPromoDto({
    required this.code,
  });
  
  factory RedeemPromoDto.fromJson(Map<String, Object?> json) => _$RedeemPromoDtoFromJson(json);
  
  /// Promo code to redeem
  final String code;

  Map<String, Object?> toJson() => _$RedeemPromoDtoToJson(this);
}
