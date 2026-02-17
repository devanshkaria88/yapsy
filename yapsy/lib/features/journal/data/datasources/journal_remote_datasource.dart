import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/error/exceptions.dart';

class JournalRemoteDataSource {
  final Dio _dio;
  JournalRemoteDataSource({required Dio dio}) : _dio = dio;

  Future<Map<String, dynamic>> getJournals({int page = 1, int limit = 20}) async {
    try {
      final r = await _dio.get(ApiEndpoints.journals, queryParameters: {'page': page, 'limit': limit});
      return r.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> getJournalDetail(String id) async {
    try {
      final r = await _dio.get(ApiEndpoints.journalById(id));
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>?> getTodayJournal() async {
    try {
      final r = await _dio.get(ApiEndpoints.journalsToday);
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>?;
    } on DioException {
      return null;
    }
  }

  Future<List<Map<String, dynamic>>> searchJournals(String query) async {
    try {
      final r = await _dio.get(ApiEndpoints.journalsSearch, queryParameters: {'q': query});
      final data = (r.data as Map<String, dynamic>)['data'];
      return data is List ? data.cast<Map<String, dynamic>>() : [];
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  String _msg(DioException e) =>
      (e.response?.data as Map<String, dynamic>?)?['message'] as String? ?? 'Request failed';
}
