// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_task_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateTaskDto _$CreateTaskDtoFromJson(Map<String, dynamic> json) =>
    CreateTaskDto(
      title: json['title'] as String,
      scheduledDate: json['scheduled_date'] as String,
      source: json['source'] as String? ?? 'manual',
      description: json['description'] as String?,
      priority: json['priority'] == null
          ? null
          : CreateTaskDtoPriority.fromJson(json['priority'] as String),
    );

Map<String, dynamic> _$CreateTaskDtoToJson(CreateTaskDto instance) =>
    <String, dynamic>{
      'title': instance.title,
      'description': instance.description,
      'scheduled_date': instance.scheduledDate,
      'priority': instance.priority,
      'source': instance.source,
    };
