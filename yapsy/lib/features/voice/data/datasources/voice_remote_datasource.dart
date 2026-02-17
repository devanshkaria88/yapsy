import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../generated/models/save_conversation_dto.dart';
import '../../../../generated/models/transcript_message_dto.dart';

class VoiceRemoteDataSource {
  final Dio _dio;
  VoiceRemoteDataSource({required Dio dio}) : _dio = dio;

  Future<Map<String, dynamic>> prepareSession() async {
    try {
      final r = await _dio.get(ApiEndpoints.conversationsPrepare);
      final body = r.data as Map<String, dynamic>;
      if (body['success'] == true) return body['data'] as Map<String, dynamic>;
      throw ServerException(message: body['message'] as String? ?? 'Failed to prepare session');
    } on DioException catch (e) {
      throw ServerException(
        message: (e.response?.data as Map<String, dynamic>?)?['message'] as String? ?? 'Failed to prepare session',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<Map<String, dynamic>> saveConversation({
    required String conversationId,
    required int durationSeconds,
    List<Map<String, dynamic>>? transcript,
    String? date,
  }) async {
    try {
      final dto = SaveConversationDto(
        conversationId: conversationId,
        durationSeconds: durationSeconds,
        transcript: (transcript ?? []).map((t) => TranscriptMessageDto.fromJson(t)).toList(),
        date: date,
      );
      final r = await _dio.post(ApiEndpoints.conversations, data: dto.toJson());
      final body = r.data as Map<String, dynamic>;
      if (body['success'] == true) return body['data'] as Map<String, dynamic>;
      throw ServerException(message: body['message'] as String? ?? 'Failed to save');
    } on DioException catch (e) {
      throw ServerException(
        message: (e.response?.data as Map<String, dynamic>?)?['message'] as String? ?? 'Failed to save',
        statusCode: e.response?.statusCode,
      );
    }
  }

  Future<Map<String, dynamic>> getConversationStatus(String id) async {
    try {
      final r = await _dio.get(ApiEndpoints.conversationStatus(id));
      final body = r.data as Map<String, dynamic>;
      if (body['success'] == true) return body['data'] as Map<String, dynamic>;
      throw ServerException(message: body['message'] as String? ?? 'Failed to get status');
    } on DioException catch (e) {
      throw ServerException(
        message: (e.response?.data as Map<String, dynamic>?)?['message'] as String? ?? 'Failed to get status',
        statusCode: e.response?.statusCode,
      );
    }
  }
}
