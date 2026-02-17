import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../generated/models/firebase_auth_dto.dart';
import '../../../../generated/models/refresh_token_dto.dart';

/// Remote data source for auth endpoints.
class AuthRemoteDataSource {
  final Dio _dio;

  AuthRemoteDataSource({required Dio dio}) : _dio = dio;

  /// Exchange Firebase ID token for backend access/refresh tokens.
  ///
  /// Returns: `{ access_token, refresh_token, user: { ... } }`
  Future<Map<String, dynamic>> authenticateWithFirebase(String idToken) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.authFirebase,
        data: FirebaseAuthDto(idToken: idToken).toJson(),
      );

      final data = response.data as Map<String, dynamic>;
      if (data['success'] == true) {
        return data['data'] as Map<String, dynamic>;
      }
      throw ServerException(
        message: data['message'] as String? ?? 'Authentication failed',
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      throw ServerException(
        message: e.response?.data?['message'] as String? ?? 'Authentication failed',
        statusCode: e.response?.statusCode,
      );
    }
  }

  /// Refresh tokens using a refresh token.
  Future<Map<String, dynamic>> refreshToken(String refreshToken) async {
    try {
      final response = await _dio.post(
        ApiEndpoints.authRefresh,
        data: RefreshTokenDto(refreshToken: refreshToken).toJson(),
      );

      final data = response.data as Map<String, dynamic>;
      if (data['success'] == true) {
        return data['data'] as Map<String, dynamic>;
      }
      throw ServerException(
        message: data['message'] as String? ?? 'Token refresh failed',
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      throw ServerException(
        message: e.response?.data?['message'] as String? ?? 'Token refresh failed',
        statusCode: e.response?.statusCode,
      );
    }
  }

  /// Get current user profile.
  Future<Map<String, dynamic>> getCurrentUser() async {
    try {
      final response = await _dio.get(ApiEndpoints.usersMe);
      final data = response.data as Map<String, dynamic>;
      if (data['success'] == true) {
        return data['data'] as Map<String, dynamic>;
      }
      throw ServerException(
        message: data['message'] as String? ?? 'Failed to get user',
        statusCode: response.statusCode,
      );
    } on DioException catch (e) {
      throw ServerException(
        message: e.response?.data?['message'] as String? ?? 'Failed to get user',
        statusCode: e.response?.statusCode,
      );
    }
  }

  /// Logout — invalidate tokens on backend.
  Future<void> logout() async {
    try {
      await _dio.post(ApiEndpoints.authLogout);
    } on DioException {
      // Swallow — we'll clear local state regardless
    }
  }
}
