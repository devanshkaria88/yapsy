// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'update_note_dto.g.dart';

@JsonSerializable()
class UpdateNoteDto {
  const UpdateNoteDto({
    this.content,
    this.followUpDate,
    this.isResolved,
  });
  
  factory UpdateNoteDto.fromJson(Map<String, Object?> json) => _$UpdateNoteDtoFromJson(json);
  
  /// Note content
  final String? content;

  /// Follow-up date
  @JsonKey(name: 'follow_up_date')
  final String? followUpDate;

  /// Whether the note is resolved
  @JsonKey(name: 'is_resolved')
  final bool? isResolved;

  Map<String, Object?> toJson() => _$UpdateNoteDtoToJson(this);
}
