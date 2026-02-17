import 'package:dio/dio.dart';
import '../auth/token_manager.dart';
import '../env.dart';
import 'api_interceptor.dart';

/// Configured Dio HTTP client for the Yapsy Mobile API.
class ApiClient {
  late final Dio dio;

  ApiClient({
    required TokenManager tokenManager,
    String? baseUrl,
    void Function()? onAuthFailed,
  }) {
    final url = baseUrl ?? Env.apiUrl;

    dio = Dio(
      BaseOptions(
        baseUrl: url,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        sendTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Separate Dio instance for refresh calls to avoid interceptor loops
    final refreshDio = Dio(
      BaseOptions(
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    dio.interceptors.addAll([
      AuthInterceptor(
        tokenManager: tokenManager,
        refreshDio: refreshDio,
        baseUrl: url,
        onAuthFailed: onAuthFailed,
      ),
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (obj) {
          // Only log in debug mode
          assert(() {
            // ignore: avoid_print
            print(obj);
            return true;
          }());
        },
      ),
    ]);
  }
}
