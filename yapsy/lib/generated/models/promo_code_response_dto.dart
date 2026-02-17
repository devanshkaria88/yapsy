// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'promo_code_response_dto_type.dart';

part 'promo_code_response_dto.g.dart';

@JsonSerializable()
class PromoCodeResponseDto {
  const PromoCodeResponseDto({
    required this.id,
    required this.code,
    required this.type,
    required this.value,
    required this.currentUses,
    required this.validFrom,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
    this.durationMonths,
    this.maxUses,
    this.validUntil,
  });
  
  factory PromoCodeResponseDto.fromJson(Map<String, Object?> json) => _$PromoCodeResponseDtoFromJson(json);
  
  final String id;
  final String code;
  final PromoCodeResponseDtoType type;
  final num value;
  @JsonKey(name: 'duration_months')
  final dynamic durationMonths;
  @JsonKey(name: 'max_uses')
  final dynamic maxUses;
  @JsonKey(name: 'current_uses')
  final num currentUses;
  @JsonKey(name: 'valid_from')
  final DateTime validFrom;
  @JsonKey(name: 'valid_until')
  final dynamic validUntil;
  @JsonKey(name: 'is_active')
  final bool isActive;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  Map<String, Object?> toJson() => _$PromoCodeResponseDtoToJson(this);
}
