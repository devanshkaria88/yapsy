// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'journal_response_dto_concern_level.dart';

part 'journal_response_dto.g.dart';

@JsonSerializable()
class JournalResponseDto {
  const JournalResponseDto({
    required this.id,
    required this.userId,
    required this.date,
    required this.durationSeconds,
    required this.transcript,
    required this.themes,
    required this.wins,
    required this.struggles,
    required this.peopleMentioned,
    required this.concernLevel,
    required this.actionsTaken,
    required this.processingStatus,
    required this.createdAt,
    required this.updatedAt,
    this.elevenlabsConversationId,
    this.summary,
    this.moodScore,
    this.moodLabel,
  });
  
  factory JournalResponseDto.fromJson(Map<String, Object?> json) => _$JournalResponseDtoFromJson(json);
  
  final String id;
  @JsonKey(name: 'user_id')
  final String userId;
  final DateTime date;
  @JsonKey(name: 'elevenlabs_conversation_id')
  final dynamic elevenlabsConversationId;
  @JsonKey(name: 'duration_seconds')
  final num durationSeconds;
  final List<dynamic> transcript;
  final dynamic summary;
  @JsonKey(name: 'mood_score')
  final dynamic moodScore;
  @JsonKey(name: 'mood_label')
  final dynamic moodLabel;
  final List<String> themes;
  final List<String> wins;
  final List<String> struggles;
  @JsonKey(name: 'people_mentioned')
  final List<String> peopleMentioned;
  @JsonKey(name: 'concern_level')
  final JournalResponseDtoConcernLevel concernLevel;
  @JsonKey(name: 'actions_taken')
  final List<dynamic> actionsTaken;
  @JsonKey(name: 'processing_status')
  final String processingStatus;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  Map<String, Object?> toJson() => _$JournalResponseDtoToJson(this);
}
