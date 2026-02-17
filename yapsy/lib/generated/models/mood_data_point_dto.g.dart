// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mood_data_point_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MoodDataPointDto _$MoodDataPointDtoFromJson(Map<String, dynamic> json) =>
    MoodDataPointDto(
      date: DateTime.parse(json['date'] as String),
      moodScore: json['mood_score'],
      moodLabel: json['mood_label'],
    );

Map<String, dynamic> _$MoodDataPointDtoToJson(MoodDataPointDto instance) =>
    <String, dynamic>{
      'date': instance.date.toIso8601String(),
      'mood_score': instance.moodScore,
      'mood_label': instance.moodLabel,
    };
