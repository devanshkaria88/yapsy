// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'transcript_message_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TranscriptMessageDto _$TranscriptMessageDtoFromJson(
  Map<String, dynamic> json,
) => TranscriptMessageDto(
  role: json['role'] as String,
  text: json['text'] as String,
  timestamp: json['timestamp'] as num,
);

Map<String, dynamic> _$TranscriptMessageDtoToJson(
  TranscriptMessageDto instance,
) => <String, dynamic>{
  'role': instance.role,
  'text': instance.text,
  'timestamp': instance.timestamp,
};
