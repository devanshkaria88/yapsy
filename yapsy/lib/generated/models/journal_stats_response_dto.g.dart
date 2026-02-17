// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'journal_stats_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

JournalStatsResponseDto _$JournalStatsResponseDtoFromJson(
  Map<String, dynamic> json,
) => JournalStatsResponseDto(
  entries: (json['entries'] as List<dynamic>)
      .map((e) => JournalResponseDto.fromJson(e as Map<String, dynamic>))
      .toList(),
  avgMood: json['avg_mood'] as num,
  totalEntries: json['total_entries'] as num,
);

Map<String, dynamic> _$JournalStatsResponseDtoToJson(
  JournalStatsResponseDto instance,
) => <String, dynamic>{
  'entries': instance.entries,
  'avg_mood': instance.avgMood,
  'total_entries': instance.totalEntries,
};
