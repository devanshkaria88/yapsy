// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'mood_data_point_dto.g.dart';

@JsonSerializable()
class MoodDataPointDto {
  const MoodDataPointDto({
    required this.date,
    this.moodScore,
    this.moodLabel,
  });
  
  factory MoodDataPointDto.fromJson(Map<String, Object?> json) => _$MoodDataPointDtoFromJson(json);
  
  final DateTime date;
  @JsonKey(name: 'mood_score')
  final dynamic moodScore;
  @JsonKey(name: 'mood_label')
  final dynamic moodLabel;

  Map<String, Object?> toJson() => _$MoodDataPointDtoToJson(this);
}
