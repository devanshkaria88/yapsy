// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'task_response_dto_priority.dart';
import 'task_response_dto_status.dart';

part 'task_response_dto.g.dart';

@JsonSerializable()
class TaskResponseDto {
  const TaskResponseDto({
    required this.id,
    required this.userId,
    required this.title,
    required this.scheduledDate,
    required this.status,
    required this.priority,
    required this.createdAt,
    required this.updatedAt,
    this.description,
    this.rolledFromId,
    this.completedAt,
    this.source,
  });
  
  factory TaskResponseDto.fromJson(Map<String, Object?> json) => _$TaskResponseDtoFromJson(json);
  
  final String id;
  @JsonKey(name: 'user_id')
  final String userId;
  final String title;
  final dynamic description;
  @JsonKey(name: 'scheduled_date')
  final DateTime scheduledDate;
  final TaskResponseDtoStatus status;
  final TaskResponseDtoPriority priority;
  @JsonKey(name: 'rolled_from_id')
  final dynamic rolledFromId;
  @JsonKey(name: 'completed_at')
  final dynamic completedAt;
  final dynamic source;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  Map<String, Object?> toJson() => _$TaskResponseDtoToJson(this);
}
