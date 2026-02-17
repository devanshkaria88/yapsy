// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'task_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TaskResponseDto _$TaskResponseDtoFromJson(Map<String, dynamic> json) =>
    TaskResponseDto(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      title: json['title'] as String,
      scheduledDate: DateTime.parse(json['scheduled_date'] as String),
      status: TaskResponseDtoStatus.fromJson(json['status'] as String),
      priority: TaskResponseDtoPriority.fromJson(json['priority'] as String),
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      description: json['description'],
      rolledFromId: json['rolled_from_id'],
      completedAt: json['completed_at'],
      source: json['source'],
    );

Map<String, dynamic> _$TaskResponseDtoToJson(TaskResponseDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.userId,
      'title': instance.title,
      'description': instance.description,
      'scheduled_date': instance.scheduledDate.toIso8601String(),
      'status': instance.status,
      'priority': instance.priority,
      'rolled_from_id': instance.rolledFromId,
      'completed_at': instance.completedAt,
      'source': instance.source,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
