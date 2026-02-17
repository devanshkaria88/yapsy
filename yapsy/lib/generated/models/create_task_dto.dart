// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'create_task_dto_priority.dart';

part 'create_task_dto.g.dart';

@JsonSerializable()
class CreateTaskDto {
  const CreateTaskDto({
    required this.title,
    required this.scheduledDate,
    this.source = 'manual',
    this.description,
    this.priority,
  });
  
  factory CreateTaskDto.fromJson(Map<String, Object?> json) => _$CreateTaskDtoFromJson(json);
  
  /// Task title
  final String title;

  /// Task description
  final String? description;

  /// Scheduled date
  @JsonKey(name: 'scheduled_date')
  final String scheduledDate;
  final CreateTaskDtoPriority? priority;

  /// Task source
  final String source;

  Map<String, Object?> toJson() => _$CreateTaskDtoToJson(this);
}
