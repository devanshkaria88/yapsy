// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'streaks_response_dto.g.dart';

@JsonSerializable()
class StreaksResponseDto {
  const StreaksResponseDto({
    required this.currentStreak,
    required this.longestStreak,
    required this.totalCheckIns,
  });
  
  factory StreaksResponseDto.fromJson(Map<String, Object?> json) => _$StreaksResponseDtoFromJson(json);
  
  @JsonKey(name: 'current_streak')
  final num currentStreak;
  @JsonKey(name: 'longest_streak')
  final num longestStreak;
  @JsonKey(name: 'total_check_ins')
  final num totalCheckIns;

  Map<String, Object?> toJson() => _$StreaksResponseDtoToJson(this);
}
