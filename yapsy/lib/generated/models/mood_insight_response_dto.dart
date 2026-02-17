// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'mood_insight_response_dto_mood_trend.dart';

part 'mood_insight_response_dto.g.dart';

@JsonSerializable()
class MoodInsightResponseDto {
  const MoodInsightResponseDto({
    required this.id,
    required this.userId,
    required this.weekStart,
    required this.topThemes,
    required this.createdAt,
    this.avgMood,
    this.moodTrend,
    this.productivityScore,
    this.insightText,
  });
  
  factory MoodInsightResponseDto.fromJson(Map<String, Object?> json) => _$MoodInsightResponseDtoFromJson(json);
  
  final String id;
  @JsonKey(name: 'user_id')
  final String userId;
  @JsonKey(name: 'week_start')
  final DateTime weekStart;
  @JsonKey(name: 'avg_mood')
  final dynamic avgMood;
  @JsonKey(name: 'mood_trend')
  final MoodInsightResponseDtoMoodTrend? moodTrend;
  @JsonKey(name: 'top_themes')
  final List<String> topThemes;
  @JsonKey(name: 'productivity_score')
  final dynamic productivityScore;
  @JsonKey(name: 'insight_text')
  final dynamic insightText;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;

  Map<String, Object?> toJson() => _$MoodInsightResponseDtoToJson(this);
}
