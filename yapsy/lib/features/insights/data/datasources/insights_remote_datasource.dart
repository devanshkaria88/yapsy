import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/error/exceptions.dart';

class InsightsRemoteDataSource {
  final Dio _dio;
  InsightsRemoteDataSource({required Dio dio}) : _dio = dio;

  Future<List<Map<String, dynamic>>> getMoodData({String period = '7d'}) async {
    try {
      final r = await _dio.get(ApiEndpoints.insightsMood, queryParameters: {'period': period});
      final data = (r.data as Map<String, dynamic>)['data'];
      return data is List ? data.cast<Map<String, dynamic>>() : [];
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<List<Map<String, dynamic>>> getThemes() async {
    try {
      final r = await _dio.get(ApiEndpoints.insightsThemes);
      final data = (r.data as Map<String, dynamic>)['data'];
      return data is List ? data.cast<Map<String, dynamic>>() : [];
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> getStreaks() async {
    try {
      final r = await _dio.get(ApiEndpoints.insightsStreaks);
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>? ?? {};
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> getWeeklyInsight() async {
    try {
      final r = await _dio.get(ApiEndpoints.insightsWeekly);
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>? ?? {};
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  String _msg(DioException e) =>
      (e.response?.data as Map<String, dynamic>?)?['message'] as String? ?? 'Request failed';
}
