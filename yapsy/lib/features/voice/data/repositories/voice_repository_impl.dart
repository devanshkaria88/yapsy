import 'package:dartz/dartz.dart';
import '../../../../core/error/error_handler.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/voice_session.dart';
import '../../domain/repositories/voice_repository.dart';
import '../datasources/voice_remote_datasource.dart';

class VoiceRepositoryImpl implements VoiceRepository {
  final VoiceRemoteDataSource _remote;
  VoiceRepositoryImpl({required VoiceRemoteDataSource remote}) : _remote = remote;

  @override
  Future<Either<Failure, VoiceSessionConfig>> prepareSession() async {
    try {
      final data = await _remote.prepareSession();
      return Right(VoiceSessionConfig(
        signedUrl: data['signed_url'] as String,
        sessionConfig: data['session_config'] as Map<String, dynamic>? ?? {},
      ));
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, String>> saveConversation({
    required String conversationId,
    required int durationSeconds,
  }) async {
    try {
      final data = await _remote.saveConversation(
        conversationId: conversationId,
        durationSeconds: durationSeconds,
      );
      return Right(data['id'] as String);
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, ConversationStatusResult>> getConversationStatus(String id) async {
    try {
      final data = await _remote.getConversationStatus(id);
      final status = switch (data['status'] as String?) {
        'completed' => ConversationStatus.completed,
        'failed' => ConversationStatus.failed,
        _ => ConversationStatus.processing,
      };
      return Right(ConversationStatusResult(
        status: status,
        journalId: data['journal_id'] as String?,
      ));
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }
}
