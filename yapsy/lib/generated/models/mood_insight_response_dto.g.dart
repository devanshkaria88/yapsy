// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mood_insight_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MoodInsightResponseDto _$MoodInsightResponseDtoFromJson(
  Map<String, dynamic> json,
) => MoodInsightResponseDto(
  id: json['id'] as String,
  userId: json['user_id'] as String,
  weekStart: DateTime.parse(json['week_start'] as String),
  topThemes: (json['top_themes'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  createdAt: DateTime.parse(json['created_at'] as String),
  avgMood: json['avg_mood'],
  moodTrend: json['mood_trend'] == null
      ? null
      : MoodInsightResponseDtoMoodTrend.fromJson(json['mood_trend'] as String),
  productivityScore: json['productivity_score'],
  insightText: json['insight_text'],
);

Map<String, dynamic> _$MoodInsightResponseDtoToJson(
  MoodInsightResponseDto instance,
) => <String, dynamic>{
  'id': instance.id,
  'user_id': instance.userId,
  'week_start': instance.weekStart.toIso8601String(),
  'avg_mood': instance.avgMood,
  'mood_trend': instance.moodTrend,
  'top_themes': instance.topThemes,
  'productivity_score': instance.productivityScore,
  'insight_text': instance.insightText,
  'created_at': instance.createdAt.toIso8601String(),
};
