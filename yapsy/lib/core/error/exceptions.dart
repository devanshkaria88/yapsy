// Data-layer exceptions — caught in repository implementations
// and converted to domain Failure instances.

class ServerException implements Exception {
  final String message;
  final int? statusCode;
  final String? code;

  const ServerException({
    required this.message,
    this.statusCode,
    this.code,
  });

  @override
  String toString() => 'ServerException($statusCode): $message';
}

class NetworkException implements Exception {
  final String message;

  const NetworkException({
    this.message = 'No internet connection',
  });

  @override
  String toString() => 'NetworkException: $message';
}

class AuthException implements Exception {
  final String message;

  const AuthException({
    this.message = 'Authentication failed',
  });

  @override
  String toString() => 'AuthException: $message';
}

class CacheException implements Exception {
  final String message;

  const CacheException({
    this.message = 'Cache operation failed',
  });

  @override
  String toString() => 'CacheException: $message';
}
