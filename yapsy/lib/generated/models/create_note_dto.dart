// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'create_note_dto_source.dart';

part 'create_note_dto.g.dart';

@JsonSerializable()
class CreateNoteDto {
  const CreateNoteDto({
    required this.content,
    this.source = CreateNoteDtoSource.manual,
    this.followUpDate,
  });
  
  factory CreateNoteDto.fromJson(Map<String, Object?> json) => _$CreateNoteDtoFromJson(json);
  
  /// Note content
  final String content;

  /// Follow-up date
  @JsonKey(name: 'follow_up_date')
  final String? followUpDate;

  /// Note source
  final CreateNoteDtoSource source;

  Map<String, Object?> toJson() => _$CreateNoteDtoToJson(this);
}
