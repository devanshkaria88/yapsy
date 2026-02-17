// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'journal_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JournalResponseDto _$JournalResponseDtoFromJson(Map<String, dynamic> json) =>
    JournalResponseDto(
      id: json['id'] as String,
      userId: json['user_id'] as String,
      date: DateTime.parse(json['date'] as String),
      durationSeconds: json['duration_seconds'] as num,
      transcript: json['transcript'] as List<dynamic>,
      themes: (json['themes'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      wins: (json['wins'] as List<dynamic>).map((e) => e as String).toList(),
      struggles: (json['struggles'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      peopleMentioned: (json['people_mentioned'] as List<dynamic>)
          .map((e) => e as String)
          .toList(),
      concernLevel: JournalResponseDtoConcernLevel.fromJson(
        json['concern_level'] as String,
      ),
      actionsTaken: json['actions_taken'] as List<dynamic>,
      processingStatus: json['processing_status'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
      elevenlabsConversationId: json['elevenlabs_conversation_id'],
      summary: json['summary'],
      moodScore: json['mood_score'],
      moodLabel: json['mood_label'],
    );

Map<String, dynamic> _$JournalResponseDtoToJson(JournalResponseDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.userId,
      'date': instance.date.toIso8601String(),
      'elevenlabs_conversation_id': instance.elevenlabsConversationId,
      'duration_seconds': instance.durationSeconds,
      'transcript': instance.transcript,
      'summary': instance.summary,
      'mood_score': instance.moodScore,
      'mood_label': instance.moodLabel,
      'themes': instance.themes,
      'wins': instance.wins,
      'struggles': instance.struggles,
      'people_mentioned': instance.peopleMentioned,
      'concern_level': instance.concernLevel,
      'actions_taken': instance.actionsTaken,
      'processing_status': instance.processingStatus,
      'created_at': instance.createdAt.toIso8601String(),
      'updated_at': instance.updatedAt.toIso8601String(),
    };
