import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/voice_session.dart';

abstract class VoiceRepository {
  Future<Either<Failure, VoiceSessionConfig>> prepareSession();
  Future<Either<Failure, String>> saveConversation({
    required String conversationId,
    required int durationSeconds,
  });
  Future<Either<Failure, ConversationStatusResult>> getConversationStatus(String id);
}
