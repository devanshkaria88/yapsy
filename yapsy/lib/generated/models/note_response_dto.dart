// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'note_response_dto.g.dart';

@JsonSerializable()
class NoteResponseDto {
  const NoteResponseDto({
    required this.id,
    required this.userId,
    required this.content,
    required this.isResolved,
    required this.createdAt,
    required this.updatedAt,
    this.followUpDate,
    this.source,
    this.journalId,
  });
  
  factory NoteResponseDto.fromJson(Map<String, Object?> json) => _$NoteResponseDtoFromJson(json);
  
  final String id;
  @JsonKey(name: 'user_id')
  final String userId;
  final String content;
  @JsonKey(name: 'follow_up_date')
  final dynamic followUpDate;
  @JsonKey(name: 'is_resolved')
  final bool isResolved;
  final dynamic source;
  @JsonKey(name: 'journal_id')
  final dynamic journalId;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  Map<String, Object?> toJson() => _$NoteResponseDtoToJson(this);
}
