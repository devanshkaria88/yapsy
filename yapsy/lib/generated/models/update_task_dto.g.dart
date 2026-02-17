// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_task_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateTaskDto _$UpdateTaskDtoFromJson(Map<String, dynamic> json) =>
    UpdateTaskDto(
      title: json['title'] as String?,
      description: json['description'] as String?,
      scheduledDate: json['scheduled_date'] as String?,
      priority: json['priority'] == null
          ? null
          : UpdateTaskDtoPriority.fromJson(json['priority'] as String),
      status: json['status'] == null
          ? null
          : UpdateTaskDtoStatus.fromJson(json['status'] as String),
    );

Map<String, dynamic> _$UpdateTaskDtoToJson(UpdateTaskDto instance) =>
    <String, dynamic>{
      'title': instance.title,
      'description': instance.description,
      'scheduled_date': instance.scheduledDate,
      'priority': instance.priority,
      'status': instance.status,
    };
