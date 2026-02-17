import 'dart:async';
import 'package:dio/dio.dart';
import '../auth/token_manager.dart';
import 'api_endpoints.dart';

/// Injects Bearer token on every request and handles 401 token refresh.
class AuthInterceptor extends QueuedInterceptor {
  final TokenManager _tokenManager;
  final Dio _refreshDio;
  final String _baseUrl;
  final void Function()? onAuthFailed;

  bool _isRefreshing = false;

  AuthInterceptor({
    required TokenManager tokenManager,
    required Dio refreshDio,
    required String baseUrl,
    this.onAuthFailed,
  })  : _tokenManager = tokenManager,
        _refreshDio = refreshDio,
        _baseUrl = baseUrl;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final accessToken = await _tokenManager.getAccessToken();
    if (accessToken != null) {
      options.headers['Authorization'] = 'Bearer $accessToken';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode != 401) {
      return handler.next(err);
    }

    // Avoid refresh loop
    if (_isRefreshing) {
      return handler.next(err);
    }

    _isRefreshing = true;

    try {
      final refreshToken = await _tokenManager.getRefreshToken();
      if (refreshToken == null) {
        _handleAuthFailure();
        return handler.next(err);
      }

      // Attempt token refresh
      final response = await _refreshDio.post(
        '$_baseUrl${ApiEndpoints.authRefresh}',
        data: {'refresh_token': refreshToken},
      );

      final data = response.data as Map<String, dynamic>;
      final responseData = data['data'] as Map<String, dynamic>?;
      
      if (responseData != null) {
        final newAccessToken = responseData['access_token'] as String;
        final newRefreshToken = responseData['refresh_token'] as String;

        await _tokenManager.saveTokens(
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        );

        // Retry the original request with new token
        final opts = err.requestOptions;
        opts.headers['Authorization'] = 'Bearer $newAccessToken';

        final retryResponse = await _refreshDio.fetch(opts);
        return handler.resolve(retryResponse);
      }

      _handleAuthFailure();
      return handler.next(err);
    } catch (_) {
      _handleAuthFailure();
      return handler.next(err);
    } finally {
      _isRefreshing = false;
    }
  }

  void _handleAuthFailure() {
    _tokenManager.clearTokens();
    onAuthFailed?.call();
  }
}
