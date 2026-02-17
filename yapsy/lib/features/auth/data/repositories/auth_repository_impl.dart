import 'package:dartz/dartz.dart';
import '../../../../core/auth/firebase_auth_service.dart';
import '../../../../core/auth/token_manager.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/auth_user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final FirebaseAuthService _firebaseAuth;
  final TokenManager _tokenManager;

  AuthRepositoryImpl({
    required AuthRemoteDataSource remoteDataSource,
    required FirebaseAuthService firebaseAuth,
    required TokenManager tokenManager,
  })  : _remoteDataSource = remoteDataSource,
        _firebaseAuth = firebaseAuth,
        _tokenManager = tokenManager;

  @override
  Future<Either<Failure, AuthUser>> signInWithGoogle() async {
    try {
      // 1. Firebase Google sign-in
      await _firebaseAuth.signInWithGoogle();

      // 2. Get Firebase ID token
      final idToken = await _firebaseAuth.getIdToken();
      if (idToken == null) {
        return const Left(AuthFailure(message: 'Failed to get Firebase token'));
      }

      // 3. Exchange with backend
      return _exchangeToken(idToken);
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message));
    } catch (e) {
      if (e.toString().contains('cancelled')) {
        return const Left(AuthFailure(message: 'Sign-in was cancelled'));
      }
      return Left(UnexpectedFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthUser>> signInWithApple() async {
    try {
      await _firebaseAuth.signInWithApple();

      final idToken = await _firebaseAuth.getIdToken();
      if (idToken == null) {
        return const Left(AuthFailure(message: 'Failed to get Firebase token'));
      }

      return _exchangeToken(idToken);
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message));
    } catch (e) {
      if (e.toString().contains('cancelled')) {
        return const Left(AuthFailure(message: 'Sign-in was cancelled'));
      }
      return Left(UnexpectedFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, AuthUser>> getCurrentUser() async {
    try {
      final data = await _remoteDataSource.getCurrentUser();
      return Right(_mapUserData(data));
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } on AuthException catch (e) {
      return Left(AuthFailure(message: e.message));
    } catch (e) {
      return Left(UnexpectedFailure(message: e.toString()));
    }
  }

  @override
  Future<Either<Failure, void>> signOut() async {
    try {
      await _remoteDataSource.logout();
      await _firebaseAuth.signOut();
      await _tokenManager.clearTokens();
      return const Right(null);
    } catch (e) {
      // Always clear local state even if backend call fails
      await _firebaseAuth.signOut();
      await _tokenManager.clearTokens();
      return const Right(null);
    }
  }

  @override
  Future<bool> isAuthenticated() => _tokenManager.hasTokens();

  /// Exchange Firebase token with backend and store tokens.
  Future<Either<Failure, AuthUser>> _exchangeToken(String firebaseToken) async {
    try {
      final data = await _remoteDataSource.authenticateWithFirebase(firebaseToken);

      final accessToken = data['access_token'] as String;
      final refreshToken = data['refresh_token'] as String;
      final userData = data['user'] as Map<String, dynamic>;

      await _tokenManager.saveTokens(
        accessToken: accessToken,
        refreshToken: refreshToken,
      );

      return Right(_mapUserData(userData));
    } on ServerException catch (e) {
      return Left(ServerFailure(message: e.message, statusCode: e.statusCode));
    } catch (e) {
      return Left(UnexpectedFailure(message: e.toString()));
    }
  }

  AuthUser _mapUserData(Map<String, dynamic> data) {
    return AuthUser(
      id: data['id'] as String,
      email: data['email'] as String? ?? '',
      name: data['name'] as String? ?? '',
      avatarUrl: data['avatar_url'] as String?,
      timezone: data['timezone'] as String?,
      subscriptionTier: data['subscription_tier'] as String? ?? 'free',
      createdAt: DateTime.parse(
        data['created_at'] as String? ?? DateTime.now().toIso8601String(),
      ),
    );
  }
}
