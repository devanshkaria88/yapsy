// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'transcript_message_dto.dart';

part 'save_conversation_dto.g.dart';

@JsonSerializable()
class SaveConversationDto {
  const SaveConversationDto({
    required this.conversationId,
    required this.transcript,
    required this.durationSeconds,
    this.date,
  });
  
  factory SaveConversationDto.fromJson(Map<String, Object?> json) => _$SaveConversationDtoFromJson(json);
  
  /// ElevenLabs conversation ID
  @JsonKey(name: 'conversation_id')
  final String conversationId;

  /// Transcript array
  final List<TranscriptMessageDto> transcript;

  /// Duration in seconds
  @JsonKey(name: 'duration_seconds')
  final num durationSeconds;

  /// Date of conversation (defaults to today)
  final String? date;

  Map<String, Object?> toJson() => _$SaveConversationDtoToJson(this);
}
