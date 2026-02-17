import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/journal_entry.dart';
import '../../domain/usecases/get_journal_detail.dart';

abstract class JournalDetailState extends Equatable {
  const JournalDetailState();
  @override
  List<Object?> get props => [];
}

class JournalDetailInitial extends JournalDetailState { const JournalDetailInitial(); }
class JournalDetailLoading extends JournalDetailState { const JournalDetailLoading(); }
class JournalDetailLoaded extends JournalDetailState {
  final JournalEntry journal;
  const JournalDetailLoaded(this.journal);
  @override
  List<Object?> get props => [journal];
}
class JournalDetailError extends JournalDetailState {
  final String message;
  const JournalDetailError(this.message);
  @override
  List<Object?> get props => [message];
}

class JournalDetailCubit extends Cubit<JournalDetailState> {
  final GetJournalDetail _getJournalDetail;
  JournalDetailCubit({required GetJournalDetail getJournalDetail})
      : _getJournalDetail = getJournalDetail,
        super(const JournalDetailInitial());

  Future<void> load(String id) async {
    emit(const JournalDetailLoading());
    final result = await _getJournalDetail(JournalDetailParams(id));
    result.fold(
      (f) => emit(JournalDetailError(f.message)),
      (journal) => emit(JournalDetailLoaded(journal)),
    );
  }
}
