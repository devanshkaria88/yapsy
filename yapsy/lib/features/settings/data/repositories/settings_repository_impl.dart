import 'package:dartz/dartz.dart';
import '../../../../core/error/error_handler.dart';
import '../../../../core/error/failures.dart';
import '../../../auth/domain/entities/auth_user.dart';
import '../../domain/repositories/settings_repository.dart';
import '../datasources/settings_remote_datasource.dart';

class SettingsRepositoryImpl implements SettingsRepository {
  final SettingsRemoteDataSource _remote;
  SettingsRepositoryImpl({required SettingsRemoteDataSource remote}) : _remote = remote;

  @override
  Future<Either<Failure, AuthUser>> getProfile() async {
    try {
      final data = await _remote.getProfile();
      return Right(_mapUser(data));
    } catch (e) { return Left(ErrorHandler.mapExceptionToFailure(e)); }
  }

  @override
  Future<Either<Failure, AuthUser>> updateProfile({String? name, String? timezone}) async {
    try {
      final data = await _remote.updateProfile(name: name, timezone: timezone);
      return Right(_mapUser(data));
    } catch (e) { return Left(ErrorHandler.mapExceptionToFailure(e)); }
  }

  @override
  Future<Either<Failure, void>> updateFcmToken(String token) async {
    try { await _remote.updateFcmToken(token); return const Right(null); }
    catch (e) { return Left(ErrorHandler.mapExceptionToFailure(e)); }
  }

  @override
  Future<Either<Failure, void>> deleteAccount() async {
    try { await _remote.deleteAccount(); return const Right(null); }
    catch (e) { return Left(ErrorHandler.mapExceptionToFailure(e)); }
  }

  AuthUser _mapUser(Map<String, dynamic> data) => AuthUser(
    id: data['id'] as String,
    email: data['email'] as String? ?? '',
    name: data['name'] as String? ?? '',
    avatarUrl: data['avatar_url'] as String?,
    timezone: data['timezone'] as String?,
    subscriptionTier: data['subscription_tier'] as String? ?? 'free',
    createdAt: DateTime.parse(data['created_at'] as String? ?? DateTime.now().toIso8601String()),
  );
}
