// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'save_conversation_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SaveConversationDto _$SaveConversationDtoFromJson(Map<String, dynamic> json) =>
    SaveConversationDto(
      conversationId: json['conversation_id'] as String,
      transcript: (json['transcript'] as List<dynamic>)
          .map((e) => TranscriptMessageDto.fromJson(e as Map<String, dynamic>))
          .toList(),
      durationSeconds: json['duration_seconds'] as num,
      date: json['date'] as String?,
    );

Map<String, dynamic> _$SaveConversationDtoToJson(
  SaveConversationDto instance,
) => <String, dynamic>{
  'conversation_id': instance.conversationId,
  'transcript': instance.transcript,
  'duration_seconds': instance.durationSeconds,
  'date': instance.date,
};
