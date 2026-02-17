import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../generated/models/update_fcm_token_dto.dart';
import '../../../../generated/models/update_user_dto.dart';

class SettingsRemoteDataSource {
  final Dio _dio;
  SettingsRemoteDataSource({required Dio dio}) : _dio = dio;

  Future<Map<String, dynamic>> getProfile() async {
    try {
      final r = await _dio.get(ApiEndpoints.usersMe);
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> updateProfile({
    String? name,
    String? avatarUrl,
    String? timezone,
  }) async {
    try {
      final dto = UpdateUserDto(name: name, avatarUrl: avatarUrl, timezone: timezone);
      final r = await _dio.patch(ApiEndpoints.usersMe, data: dto.toJson());
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<void> updateFcmToken(String token) async {
    try {
      final dto = UpdateFcmTokenDto(fcmToken: token);
      await _dio.patch(ApiEndpoints.usersFcmToken, data: dto.toJson());
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<void> deleteAccount() async {
    try {
      await _dio.delete(ApiEndpoints.usersMe);
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  String _msg(DioException e) =>
      (e.response?.data as Map<String, dynamic>?)?['message'] as String? ?? 'Request failed';
}
