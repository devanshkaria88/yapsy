import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/voice_session.dart';
import '../repositories/voice_repository.dart';

class PrepareSession extends UseCase<VoiceSessionConfig, NoParams> {
  final VoiceRepository repository;
  PrepareSession(this.repository);

  @override
  Future<Either<Failure, VoiceSessionConfig>> call(NoParams params) =>
      repository.prepareSession();
}
