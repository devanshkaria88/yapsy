// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'update_task_dto_priority.dart';
import 'update_task_dto_status.dart';

part 'update_task_dto.g.dart';

@JsonSerializable()
class UpdateTaskDto {
  const UpdateTaskDto({
    this.title,
    this.description,
    this.scheduledDate,
    this.priority,
    this.status,
  });
  
  factory UpdateTaskDto.fromJson(Map<String, Object?> json) => _$UpdateTaskDtoFromJson(json);
  
  /// Task title
  final String? title;

  /// Task description
  final String? description;

  /// Scheduled date
  @JsonKey(name: 'scheduled_date')
  final String? scheduledDate;
  final UpdateTaskDtoPriority? priority;
  final UpdateTaskDtoStatus? status;

  Map<String, Object?> toJson() => _$UpdateTaskDtoToJson(this);
}
