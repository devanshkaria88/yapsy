import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../auth/domain/entities/auth_user.dart';

abstract class SettingsRepository {
  Future<Either<Failure, AuthUser>> getProfile();
  Future<Either<Failure, AuthUser>> updateProfile({String? name, String? timezone});
  Future<Either<Failure, void>> updateFcmToken(String token);
  Future<Either<Failure, void>> deleteAccount();
}
