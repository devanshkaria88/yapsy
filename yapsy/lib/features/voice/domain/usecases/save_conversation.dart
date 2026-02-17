import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../repositories/voice_repository.dart';

class SaveConversation extends UseCase<String, SaveConversationParams> {
  final VoiceRepository repository;
  SaveConversation(this.repository);

  @override
  Future<Either<Failure, String>> call(SaveConversationParams params) =>
      repository.saveConversation(
        conversationId: params.conversationId,
        durationSeconds: params.durationSeconds,
      );
}

class SaveConversationParams extends Equatable {
  final String conversationId;
  final int durationSeconds;
  const SaveConversationParams({required this.conversationId, required this.durationSeconds});
  @override
  List<Object?> get props => [conversationId, durationSeconds];
}
