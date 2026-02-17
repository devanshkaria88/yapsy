import 'package:equatable/equatable.dart';

enum OrbState { idle, connecting, listening, processing, speaking, error, celebration }

enum ConversationStatus { processing, completed, failed }

class VoiceSessionConfig extends Equatable {
  final String signedUrl;
  final Map<String, dynamic> sessionConfig;

  const VoiceSessionConfig({required this.signedUrl, required this.sessionConfig});

  @override
  List<Object?> get props => [signedUrl, sessionConfig];
}

class ConversationStatusResult extends Equatable {
  final ConversationStatus status;
  final String? journalId;

  const ConversationStatusResult({required this.status, this.journalId});

  @override
  List<Object?> get props => [status, journalId];
}
