import 'dart:async';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/usecase/usecase.dart';
import '../../domain/entities/voice_session.dart';
import '../../domain/usecases/poll_processing_status.dart';
import '../../domain/usecases/prepare_session.dart';
import '../../domain/usecases/save_conversation.dart';

// ─── Events ──────────────────────────────────────────────

abstract class VoiceEvent extends Equatable {
  const VoiceEvent();
  @override
  List<Object?> get props => [];
}

class VoicePrepareSession extends VoiceEvent { const VoicePrepareSession(); }
class VoiceStartSession extends VoiceEvent { const VoiceStartSession(); }
class VoiceOrbStateChanged extends VoiceEvent {
  final OrbState orbState;
  const VoiceOrbStateChanged(this.orbState);
  @override
  List<Object?> get props => [orbState];
}
class VoiceTranscriptUpdated extends VoiceEvent {
  final String role;
  final String text;
  const VoiceTranscriptUpdated({required this.role, required this.text});
  @override
  List<Object?> get props => [role, text];
}
class VoiceEndSession extends VoiceEvent { const VoiceEndSession(); }
class VoicePollStatus extends VoiceEvent {
  final String conversationId;
  const VoicePollStatus(this.conversationId);
  @override
  List<Object?> get props => [conversationId];
}

// ─── States ──────────────────────────────────────────────

abstract class VoiceState extends Equatable {
  const VoiceState();
  @override
  List<Object?> get props => [];
}

class VoiceIdle extends VoiceState { const VoiceIdle(); }
class VoicePreparing extends VoiceState { const VoicePreparing(); }
class VoiceReady extends VoiceState {
  final VoiceSessionConfig config;
  const VoiceReady(this.config);
  @override
  List<Object?> get props => [config];
}
class VoiceActive extends VoiceState {
  final OrbState orbState;
  final List<TranscriptEntry> transcript;
  final Duration elapsed;

  const VoiceActive({
    this.orbState = OrbState.listening,
    this.transcript = const [],
    this.elapsed = Duration.zero,
  });

  VoiceActive copyWith({OrbState? orbState, List<TranscriptEntry>? transcript, Duration? elapsed}) =>
      VoiceActive(
        orbState: orbState ?? this.orbState,
        transcript: transcript ?? this.transcript,
        elapsed: elapsed ?? this.elapsed,
      );

  @override
  List<Object?> get props => [orbState, transcript, elapsed];
}
class VoiceProcessingState extends VoiceState {
  final String conversationId;
  final int step; // 0-3 for progress steps
  const VoiceProcessingState({required this.conversationId, this.step = 0});
  @override
  List<Object?> get props => [conversationId, step];
}
class VoiceCompleted extends VoiceState {
  final String journalId;
  const VoiceCompleted(this.journalId);
  @override
  List<Object?> get props => [journalId];
}
class VoiceError extends VoiceState {
  final String message;
  const VoiceError(this.message);
  @override
  List<Object?> get props => [message];
}

class TranscriptEntry extends Equatable {
  final String role; // 'user' or 'agent'
  final String text;
  const TranscriptEntry({required this.role, required this.text});
  @override
  List<Object?> get props => [role, text];
}

// ─── BLoC ────────────────────────────────────────────────

class VoiceSessionBloc extends Bloc<VoiceEvent, VoiceState> {
  final PrepareSession _prepareSession;
  final SaveConversation _saveConversation;
  final PollProcessingStatus _pollStatus;
  Timer? _pollingTimer;
  Timer? _elapsedTimer;
  DateTime? _sessionStart;

  VoiceSessionBloc({
    required PrepareSession prepareSession,
    required SaveConversation saveConversation,
    required PollProcessingStatus pollStatus,
  })  : _prepareSession = prepareSession,
        _saveConversation = saveConversation,
        _pollStatus = pollStatus,
        super(const VoiceIdle()) {
    on<VoicePrepareSession>(_onPrepare);
    on<VoiceStartSession>(_onStart);
    on<VoiceOrbStateChanged>(_onOrbChanged);
    on<VoiceTranscriptUpdated>(_onTranscript);
    on<VoiceEndSession>(_onEnd);
    on<VoicePollStatus>(_onPoll);
  }

  Future<void> _onPrepare(VoicePrepareSession event, Emitter<VoiceState> emit) async {
    emit(const VoicePreparing());
    final result = await _prepareSession(const NoParams());
    result.fold(
      (f) => emit(VoiceError(f.message)),
      (config) => emit(VoiceReady(config)),
    );
  }

  void _onStart(VoiceStartSession event, Emitter<VoiceState> emit) {
    _sessionStart = DateTime.now();
    emit(const VoiceActive(orbState: OrbState.connecting));
  }

  void _onOrbChanged(VoiceOrbStateChanged event, Emitter<VoiceState> emit) {
    if (state is VoiceActive) {
      emit((state as VoiceActive).copyWith(orbState: event.orbState));
    }
  }

  void _onTranscript(VoiceTranscriptUpdated event, Emitter<VoiceState> emit) {
    if (state is VoiceActive) {
      final current = state as VoiceActive;
      final updated = [...current.transcript, TranscriptEntry(role: event.role, text: event.text)];
      emit(current.copyWith(transcript: updated));
    }
  }

  Future<void> _onEnd(VoiceEndSession event, Emitter<VoiceState> emit) async {
    _elapsedTimer?.cancel();
    final duration = _sessionStart != null
        ? DateTime.now().difference(_sessionStart!).inSeconds
        : 0;

    // Save conversation via API
    emit(const VoiceProcessingState(conversationId: '', step: 0));

    final result = await _saveConversation(SaveConversationParams(
      conversationId: 'session', // Would come from WS
      durationSeconds: duration,
    ));

    result.fold(
      (f) => emit(VoiceError(f.message)),
      (convId) {
        emit(VoiceProcessingState(conversationId: convId, step: 1));
        add(VoicePollStatus(convId));
      },
    );
  }

  Future<void> _onPoll(VoicePollStatus event, Emitter<VoiceState> emit) async {
    int step = 1;
    for (int i = 0; i < 30; i++) {
      await Future<void>.delayed(const Duration(seconds: 2));
      final result = await _pollStatus(PollStatusParams(event.conversationId));

      result.fold(
        (f) => null, // Keep polling on transient errors
        (status) {
          if (status.status == ConversationStatus.completed && status.journalId != null) {
            emit(VoiceCompleted(status.journalId!));
            return;
          }
          if (status.status == ConversationStatus.failed) {
            emit(const VoiceError('Processing failed. Please try again.'));
            return;
          }
          step = (step + 1).clamp(1, 3);
          emit(VoiceProcessingState(conversationId: event.conversationId, step: step));
        },
      );

      if (state is VoiceCompleted || state is VoiceError) return;
    }

    emit(const VoiceError('Processing timed out. Please check your journal later.'));
  }

  @override
  Future<void> close() {
    _pollingTimer?.cancel();
    _elapsedTimer?.cancel();
    return super.close();
  }
}
