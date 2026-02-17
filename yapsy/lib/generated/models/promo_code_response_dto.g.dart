// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'promo_code_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PromoCodeResponseDto _$PromoCodeResponseDtoFromJson(
  Map<String, dynamic> json,
) => PromoCodeResponseDto(
  id: json['id'] as String,
  code: json['code'] as String,
  type: PromoCodeResponseDtoType.fromJson(json['type'] as String),
  value: json['value'] as num,
  currentUses: json['current_uses'] as num,
  validFrom: DateTime.parse(json['valid_from'] as String),
  isActive: json['is_active'] as bool,
  createdAt: DateTime.parse(json['created_at'] as String),
  updatedAt: DateTime.parse(json['updated_at'] as String),
  durationMonths: json['duration_months'],
  maxUses: json['max_uses'],
  validUntil: json['valid_until'],
);

Map<String, dynamic> _$PromoCodeResponseDtoToJson(
  PromoCodeResponseDto instance,
) => <String, dynamic>{
  'id': instance.id,
  'code': instance.code,
  'type': instance.type,
  'value': instance.value,
  'duration_months': instance.durationMonths,
  'max_uses': instance.maxUses,
  'current_uses': instance.currentUses,
  'valid_from': instance.validFrom.toIso8601String(),
  'valid_until': instance.validUntil,
  'is_active': instance.isActive,
  'created_at': instance.createdAt.toIso8601String(),
  'updated_at': instance.updatedAt.toIso8601String(),
};
