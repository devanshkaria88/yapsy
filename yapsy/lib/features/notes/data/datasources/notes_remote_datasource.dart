import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../generated/models/create_note_dto.dart';
import '../../../../generated/models/update_note_dto.dart';

class NotesRemoteDataSource {
  final Dio _dio;
  NotesRemoteDataSource({required Dio dio}) : _dio = dio;

  Future<List<Map<String, dynamic>>> getNotes() async {
    try {
      final r = await _dio.get(ApiEndpoints.notes);
      final data = (r.data as Map<String, dynamic>)['data'];
      return (data as List).cast<Map<String, dynamic>>();
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> createNote(String content) async {
    try {
      final dto = CreateNoteDto(content: content);
      final r = await _dio.post(ApiEndpoints.notes, data: dto.toJson());
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> updateNote(String id, String content) async {
    try {
      final dto = UpdateNoteDto(content: content);
      final r = await _dio.patch(ApiEndpoints.noteById(id), data: dto.toJson());
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<void> deleteNote(String id) async {
    try {
      await _dio.delete(ApiEndpoints.noteById(id));
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  String _msg(DioException e) =>
      (e.response?.data as Map<String, dynamic>?)?['message'] as String? ?? 'Request failed';
}
