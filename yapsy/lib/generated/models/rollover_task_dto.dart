// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'rollover_task_dto.g.dart';

@JsonSerializable()
class RolloverTaskDto {
  const RolloverTaskDto({
    required this.newDate,
  });
  
  factory RolloverTaskDto.fromJson(Map<String, Object?> json) => _$RolloverTaskDtoFromJson(json);
  
  /// New date for the rolled-over task
  @JsonKey(name: 'new_date')
  final String newDate;

  Map<String, Object?> toJson() => _$RolloverTaskDtoToJson(this);
}
