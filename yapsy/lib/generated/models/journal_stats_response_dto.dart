// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'journal_response_dto.dart';

part 'journal_stats_response_dto.g.dart';

@JsonSerializable()
class JournalStatsResponseDto {
  const JournalStatsResponseDto({
    required this.entries,
    required this.avgMood,
    required this.totalEntries,
  });
  
  factory JournalStatsResponseDto.fromJson(Map<String, Object?> json) => _$JournalStatsResponseDtoFromJson(json);
  
  final List<JournalResponseDto> entries;
  @JsonKey(name: 'avg_mood')
  final num avgMood;
  @JsonKey(name: 'total_entries')
  final num totalEntries;

  Map<String, Object?> toJson() => _$JournalStatsResponseDtoToJson(this);
}
