// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'productivity_period_dto.dart';

part 'productivity_response_dto.g.dart';

@JsonSerializable()
class ProductivityResponseDto {
  const ProductivityResponseDto({
    required this.week,
    required this.twoWeeks,
    required this.month,
  });
  
  factory ProductivityResponseDto.fromJson(Map<String, Object?> json) => _$ProductivityResponseDtoFromJson(json);
  
  final ProductivityPeriodDto week;
  @JsonKey(name: 'two_weeks')
  final ProductivityPeriodDto twoWeeks;
  final ProductivityPeriodDto month;

  Map<String, Object?> toJson() => _$ProductivityResponseDtoToJson(this);
}
