// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'update_note_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UpdateNoteDto _$UpdateNoteDtoFromJson(Map<String, dynamic> json) =>
    UpdateNoteDto(
      content: json['content'] as String?,
      followUpDate: json['follow_up_date'] as String?,
      isResolved: json['is_resolved'] as bool?,
    );

Map<String, dynamic> _$UpdateNoteDtoToJson(UpdateNoteDto instance) =>
    <String, dynamic>{
      'content': instance.content,
      'follow_up_date': instance.followUpDate,
      'is_resolved': instance.isResolved,
    };
