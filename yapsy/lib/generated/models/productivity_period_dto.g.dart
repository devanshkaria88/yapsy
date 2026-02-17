// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'productivity_period_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductivityPeriodDto _$ProductivityPeriodDtoFromJson(
  Map<String, dynamic> json,
) => ProductivityPeriodDto(
  completed: json['completed'] as num,
  total: json['total'] as num,
  rate: json['rate'] as num,
);

Map<String, dynamic> _$ProductivityPeriodDtoToJson(
  ProductivityPeriodDto instance,
) => <String, dynamic>{
  'completed': instance.completed,
  'total': instance.total,
  'rate': instance.rate,
};
