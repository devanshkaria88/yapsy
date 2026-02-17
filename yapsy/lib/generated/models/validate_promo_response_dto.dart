// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'promo_code_response_dto.dart';

part 'validate_promo_response_dto.g.dart';

@JsonSerializable()
class ValidatePromoResponseDto {
  const ValidatePromoResponseDto({
    required this.promo,
    required this.discountAmount,
    required this.finalPrice,
  });
  
  factory ValidatePromoResponseDto.fromJson(Map<String, Object?> json) => _$ValidatePromoResponseDtoFromJson(json);
  
  final PromoCodeResponseDto promo;

  /// Discount amount in paise
  final num discountAmount;

  /// Final price after discount in paise
  final num finalPrice;

  Map<String, Object?> toJson() => _$ValidatePromoResponseDtoToJson(this);
}
