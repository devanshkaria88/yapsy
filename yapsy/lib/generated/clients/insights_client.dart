// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/days.dart';
import '../models/mood_data_point_dto.dart';
import '../models/mood_insight_response_dto.dart';
import '../models/productivity_response_dto.dart';
import '../models/streaks_response_dto.dart';
import '../models/theme_count_dto.dart';

part 'insights_client.g.dart';

@RestApi()
abstract class InsightsClient {
  factory InsightsClient(Dio dio, {String? baseUrl}) = _InsightsClient;

  /// Get mood data for the last N days.
  ///
  /// [days] - Number of days for mood data.
  @GET('/api/v1/mobile/insights/mood')
  Future<List<MoodDataPointDto>> mobileInsightsControllerGetMoodData({
    @Query('days') Days? days = Days.value7,
  });

  /// Get top themes from last 30 days of journals
  @GET('/api/v1/mobile/insights/themes')
  Future<List<ThemeCountDto>> mobileInsightsControllerGetThemes();

  /// Get streak data (current, longest, total check-ins)
  @GET('/api/v1/mobile/insights/streaks')
  Future<StreaksResponseDto> mobileInsightsControllerGetStreaks();

  /// Get weekly AI insight (Pro only)
  @GET('/api/v1/mobile/insights/weekly')
  Future<MoodInsightResponseDto> mobileInsightsControllerGetWeeklyInsight();

  /// Get task productivity stats (Pro only)
  @GET('/api/v1/mobile/insights/productivity')
  Future<ProductivityResponseDto> mobileInsightsControllerGetProductivity();
}
