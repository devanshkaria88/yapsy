import 'package:dio/dio.dart';
import 'exceptions.dart';
import 'failures.dart';

/// Maps data-layer exceptions to domain failures.
class ErrorHandler {
  ErrorHandler._();

  /// Convert a [DioException] into a typed data-layer exception.
  static ServerException handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        throw const NetworkException(message: 'Connection timed out');

      case DioExceptionType.connectionError:
        throw const NetworkException(message: 'Unable to connect to server');

      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final data = error.response?.data;
        String message = 'Server error';
        String? code;

        if (data is Map<String, dynamic>) {
          message = (data['message'] as String?) ?? message;
          code = data['error'] as String?;
        }

        if (statusCode == 401) {
          throw AuthException(message: message);
        }
        if (statusCode == 403 && code == 'SUBSCRIPTION_REQUIRED') {
          throw ServerException(
            message: message,
            statusCode: statusCode,
            code: 'SUBSCRIPTION_REQUIRED',
          );
        }

        return ServerException(
          message: message,
          statusCode: statusCode,
          code: code,
        );

      case DioExceptionType.cancel:
        return const ServerException(message: 'Request cancelled');

      default:
        return ServerException(
          message: error.message ?? 'Unknown error occurred',
        );
    }
  }

  /// Convert any exception into a domain [Failure].
  static Failure mapExceptionToFailure(Object error) {
    if (error is ServerException) {
      if (error.code == 'SUBSCRIPTION_REQUIRED') {
        return const SubscriptionRequiredFailure();
      }
      return ServerFailure(
        message: error.message,
        statusCode: error.statusCode,
        code: error.code ?? 'SERVER_ERROR',
      );
    }
    if (error is NetworkException) {
      return NetworkFailure(message: error.message);
    }
    if (error is AuthException) {
      return AuthFailure(message: error.message);
    }
    if (error is CacheException) {
      return CacheFailure(message: error.message);
    }
    return UnexpectedFailure(message: error.toString());
  }
}
