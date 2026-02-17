import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/error/exceptions.dart';

/// Remote data source for task endpoints.
class TaskRemoteDataSource {
  final Dio _dio;
  TaskRemoteDataSource({required Dio dio}) : _dio = dio;

  Future<List<Map<String, dynamic>>> getTodayTasks() async =>
      _getTaskList(ApiEndpoints.tasksToday);

  Future<List<Map<String, dynamic>>> getOverdueTasks() async =>
      _getTaskList(ApiEndpoints.tasksOverdue);

  Future<List<Map<String, dynamic>>> getUpcomingTasks() async =>
      _getTaskList(ApiEndpoints.tasksUpcoming);

  Future<Map<String, dynamic>> getCalendarData(int year, int month) async {
    try {
      final response = await _dio.get(ApiEndpoints.tasksCalendar(year, month));
      return _extractData(response) as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> getTaskById(String id) async {
    try {
      final response = await _dio.get(ApiEndpoints.taskById(id));
      return _extractData(response) as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> createTask(Map<String, dynamic> body) async {
    try {
      final response = await _dio.post(ApiEndpoints.tasks, data: body);
      return _extractData(response) as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> updateTask(String id, Map<String, dynamic> body) async {
    try {
      final response = await _dio.patch(ApiEndpoints.taskById(id), data: body);
      return _extractData(response) as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> completeTask(String id) async {
    try {
      final response = await _dio.patch(ApiEndpoints.taskComplete(id));
      return _extractData(response) as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<Map<String, dynamic>> rolloverTask(String id) async {
    try {
      final response = await _dio.post(ApiEndpoints.taskRollover(id));
      return _extractData(response) as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<void> deleteTask(String id) async {
    try {
      await _dio.delete(ApiEndpoints.taskById(id));
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  Future<List<Map<String, dynamic>>> _getTaskList(String endpoint) async {
    try {
      final response = await _dio.get(endpoint);
      final data = _extractData(response);
      if (data is List) {
        return data.cast<Map<String, dynamic>>();
      }
      return [];
    } on DioException catch (e) {
      throw _handleError(e);
    }
  }

  dynamic _extractData(Response<dynamic> response) {
    final body = response.data as Map<String, dynamic>;
    if (body['success'] == true) return body['data'];
    throw ServerException(
      message: body['message'] as String? ?? 'Request failed',
      statusCode: response.statusCode,
    );
  }

  ServerException _handleError(DioException e) => ServerException(
    message: (e.response?.data as Map<String, dynamic>?)?['message'] as String? ?? 'Request failed',
    statusCode: e.response?.statusCode,
  );
}
