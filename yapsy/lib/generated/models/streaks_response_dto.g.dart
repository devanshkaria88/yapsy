// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'streaks_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StreaksResponseDto _$StreaksResponseDtoFromJson(Map<String, dynamic> json) =>
    StreaksResponseDto(
      currentStreak: json['current_streak'] as num,
      longestStreak: json['longest_streak'] as num,
      totalCheckIns: json['total_check_ins'] as num,
    );

Map<String, dynamic> _$StreaksResponseDtoToJson(StreaksResponseDto instance) =>
    <String, dynamic>{
      'current_streak': instance.currentStreak,
      'longest_streak': instance.longestStreak,
      'total_check_ins': instance.totalCheckIns,
    };
