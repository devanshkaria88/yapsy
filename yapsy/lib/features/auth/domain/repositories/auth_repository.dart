import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/auth_user.dart';

/// Auth repository contract — implemented in data layer.
abstract class AuthRepository {
  /// Sign in with Google → Firebase → Backend token exchange.
  Future<Either<Failure, AuthUser>> signInWithGoogle();

  /// Sign in with Apple → Firebase → Backend token exchange.
  Future<Either<Failure, AuthUser>> signInWithApple();

  /// Get the currently signed-in user from backend.
  Future<Either<Failure, AuthUser>> getCurrentUser();

  /// Sign out from Firebase + clear backend tokens.
  Future<Either<Failure, void>> signOut();

  /// Check if user has valid stored tokens.
  Future<bool> isAuthenticated();
}
