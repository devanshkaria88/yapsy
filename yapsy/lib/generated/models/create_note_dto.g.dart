// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_note_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateNoteDto _$CreateNoteDtoFromJson(Map<String, dynamic> json) =>
    CreateNoteDto(
      content: json['content'] as String,
      source: json['source'] == null
          ? CreateNoteDtoSource.manual
          : CreateNoteDtoSource.fromJson(json['source'] as String),
      followUpDate: json['follow_up_date'] as String?,
    );

Map<String, dynamic> _$CreateNoteDtoToJson(CreateNoteDto instance) =>
    <String, dynamic>{
      'content': instance.content,
      'follow_up_date': instance.followUpDate,
      'source': instance.source,
    };
