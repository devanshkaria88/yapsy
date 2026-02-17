// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'productivity_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductivityResponseDto _$ProductivityResponseDtoFromJson(
  Map<String, dynamic> json,
) => ProductivityResponseDto(
  week: ProductivityPeriodDto.fromJson(json['week'] as Map<String, dynamic>),
  twoWeeks: ProductivityPeriodDto.fromJson(
    json['two_weeks'] as Map<String, dynamic>,
  ),
  month: ProductivityPeriodDto.fromJson(json['month'] as Map<String, dynamic>),
);

Map<String, dynamic> _$ProductivityResponseDtoToJson(
  ProductivityResponseDto instance,
) => <String, dynamic>{
  'week': instance.week,
  'two_weeks': instance.twoWeeks,
  'month': instance.month,
};
