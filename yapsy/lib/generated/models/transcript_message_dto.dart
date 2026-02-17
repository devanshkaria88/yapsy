// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'transcript_message_dto.g.dart';

@JsonSerializable()
class TranscriptMessageDto {
  const TranscriptMessageDto({
    required this.role,
    required this.text,
    required this.timestamp,
  });
  
  factory TranscriptMessageDto.fromJson(Map<String, Object?> json) => _$TranscriptMessageDtoFromJson(json);
  
  /// Role (user/assistant)
  final String role;

  /// Message text
  final String text;

  /// Timestamp in seconds
  final num timestamp;

  Map<String, Object?> toJson() => _$TranscriptMessageDtoToJson(this);
}
