import 'package:equatable/equatable.dart';

/// Base failure class for domain-layer error handling.
abstract class Failure extends Equatable {
  final String message;
  final String code;

  const Failure({
    required this.message,
    this.code = 'UNKNOWN',
  });

  @override
  List<Object> get props => [message, code];
}

/// Server returned an error (4xx / 5xx).
class ServerFailure extends Failure {
  final int? statusCode;

  const ServerFailure({
    required super.message,
    super.code = 'SERVER_ERROR',
    this.statusCode,
  });

  @override
  List<Object> get props => [message, code, statusCode ?? 0];
}

/// No internet connection.
class NetworkFailure extends Failure {
  const NetworkFailure({
    super.message = 'No internet connection. Please check your network.',
    super.code = 'NETWORK_ERROR',
  });
}

/// Authentication failure (401 or token issues).
class AuthFailure extends Failure {
  const AuthFailure({
    super.message = 'Authentication failed. Please sign in again.',
    super.code = 'AUTH_ERROR',
  });
}

/// Feature requires active subscription.
class SubscriptionRequiredFailure extends Failure {
  const SubscriptionRequiredFailure({
    super.message = 'This feature requires a Yapsy Pro subscription.',
    super.code = 'SUBSCRIPTION_REQUIRED',
  });
}

/// Cache or local storage failure.
class CacheFailure extends Failure {
  const CacheFailure({
    super.message = 'Failed to access local storage.',
    super.code = 'CACHE_ERROR',
  });
}

/// Input validation failure.
class ValidationFailure extends Failure {
  const ValidationFailure({
    required super.message,
    super.code = 'VALIDATION_ERROR',
  });
}

/// Unknown / unexpected failure.
class UnexpectedFailure extends Failure {
  const UnexpectedFailure({
    super.message = 'An unexpected error occurred. Please try again.',
    super.code = 'UNEXPECTED_ERROR',
  });
}
