// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/get_api_v1_mobile_journals_response.dart';
import '../models/get_api_v1_mobile_journals_search_response.dart';
import '../models/journal_response_dto.dart';
import '../models/journal_stats_response_dto.dart';

part 'journals_client.g.dart';

@RestApi()
abstract class JournalsClient {
  factory JournalsClient(Dio dio, {String? baseUrl}) = _JournalsClient;

  /// Get all journals with pagination and date filters.
  ///
  /// [from] - Filter from date.
  ///
  /// [to] - Filter to date.
  @GET('/api/v1/mobile/journals')
  Future<GetApiV1MobileJournalsResponse> mobileJournalsControllerFindAll({
    @Query('from') String? from,
    @Query('to') String? to,
    @Query('page') num? page = 1,
    @Query('limit') num? limit = 20,
  });

  /// Get journal for today
  @GET('/api/v1/mobile/journals/today')
  Future<JournalResponseDto> mobileJournalsControllerFindToday();

  /// Get journal stats for last N days.
  ///
  /// [days] - Number of days for stats.
  @GET('/api/v1/mobile/journals/stats')
  Future<JournalStatsResponseDto> mobileJournalsControllerFindStats({
    @Query('days') num? days = 30,
  });

  /// Search journals by keyword (Pro only).
  ///
  /// [q] - Search keyword.
  ///
  /// [theme] - Filter by theme.
  @GET('/api/v1/mobile/journals/search')
  Future<GetApiV1MobileJournalsSearchResponse> mobileJournalsControllerSearch({
    @Query('q') required String q,
    @Query('theme') String? theme,
    @Query('page') num? page = 1,
    @Query('limit') num? limit = 20,
  });

  /// Get a journal by ID.
  ///
  /// [id] - Journal ID.
  @GET('/api/v1/mobile/journals/{id}')
  Future<JournalResponseDto> mobileJournalsControllerFindOne({
    @Path('id') required String id,
  });
}
