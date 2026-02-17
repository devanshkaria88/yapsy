import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/voice_session.dart';
import '../repositories/voice_repository.dart';

class PollProcessingStatus extends UseCase<ConversationStatusResult, PollStatusParams> {
  final VoiceRepository repository;
  PollProcessingStatus(this.repository);

  @override
  Future<Either<Failure, ConversationStatusResult>> call(PollStatusParams params) =>
      repository.getConversationStatus(params.conversationId);
}

class PollStatusParams extends Equatable {
  final String conversationId;
  const PollStatusParams(this.conversationId);
  @override
  List<Object?> get props => [conversationId];
}
