import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';

/// Aggregates multiple API calls for the dashboard.
class HomeRemoteDataSource {
  final Dio _dio;
  HomeRemoteDataSource({required Dio dio}) : _dio = dio;

  Future<List<Map<String, dynamic>>> getTodayTasks() async {
    try {
      final r = await _dio.get(ApiEndpoints.tasksToday);
      final data = (r.data as Map<String, dynamic>)['data'];
      return data is List ? data.cast<Map<String, dynamic>>() : [];
    } catch (_) {
      return [];
    }
  }

  Future<List<Map<String, dynamic>>> getOverdueTasks() async {
    try {
      final r = await _dio.get(ApiEndpoints.tasksOverdue);
      final data = (r.data as Map<String, dynamic>)['data'];
      return data is List ? data.cast<Map<String, dynamic>>() : [];
    } catch (_) {
      return [];
    }
  }

  Future<Map<String, dynamic>> getStreaks() async {
    try {
      final r = await _dio.get(ApiEndpoints.insightsStreaks);
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>? ?? {};
    } catch (_) {
      return {};
    }
  }

  Future<List<Map<String, dynamic>>> getMoodData({String period = '7d'}) async {
    try {
      final r = await _dio.get(ApiEndpoints.insightsMood, queryParameters: {'period': period});
      final data = (r.data as Map<String, dynamic>)['data'];
      return data is List ? data.cast<Map<String, dynamic>>() : [];
    } catch (_) {
      return [];
    }
  }

  Future<List<String>> getThemes() async {
    try {
      final r = await _dio.get(ApiEndpoints.insightsThemes);
      final data = (r.data as Map<String, dynamic>)['data'];
      if (data is List) return data.map((e) => (e as Map<String, dynamic>)['theme'] as String? ?? '').where((s) => s.isNotEmpty).toList();
      return [];
    } catch (_) {
      return [];
    }
  }

  Future<Map<String, dynamic>?> getTodayJournal() async {
    try {
      final r = await _dio.get(ApiEndpoints.journalsToday);
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>?;
    } catch (_) {
      return null;
    }
  }
}
