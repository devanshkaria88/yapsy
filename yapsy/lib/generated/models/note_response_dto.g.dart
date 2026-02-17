// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'note_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

NoteResponseDto _$NoteResponseDtoFromJson(Map<String, dynamic> json) =>
    NoteResponseDto(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      content: json['content'] as String,
      isResolved: json['is_resolved'] as bool,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      followUpDate: json['follow_up_date'],
      source: json['source'],
      journalId: json['journal_id'],
    );

Map<String, dynamic> _$NoteResponseDtoToJson(NoteResponseDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.userId,
      'content': instance.content,
      'follow_up_date': instance.followUpDate,
      'is_resolved': instance.isResolved,
      'source': instance.source,
      'journal_id': instance.journalId,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
