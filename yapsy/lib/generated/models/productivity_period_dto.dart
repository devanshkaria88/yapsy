// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'productivity_period_dto.g.dart';

@JsonSerializable()
class ProductivityPeriodDto {
  const ProductivityPeriodDto({
    required this.completed,
    required this.total,
    required this.rate,
  });
  
  factory ProductivityPeriodDto.fromJson(Map<String, Object?> json) => _$ProductivityPeriodDtoFromJson(json);
  
  final num completed;
  final num total;

  /// Completion rate percentage
  final num rate;

  Map<String, Object?> toJson() => _$ProductivityPeriodDtoToJson(this);
}
