import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/journal_entry.dart';
import '../../domain/usecases/get_journals.dart';
import '../../domain/usecases/search_journals.dart';

// States
abstract class JournalListState extends Equatable {
  const JournalListState();
  @override
  List<Object?> get props => [];
}

class JournalListInitial extends JournalListState { const JournalListInitial(); }
class JournalListLoading extends JournalListState { const JournalListLoading(); }
class JournalListLoaded extends JournalListState {
  final List<JournalEntry> journals;
  final bool hasMore;
  final int currentPage;
  final bool isSearching;

  const JournalListLoaded({
    required this.journals, this.hasMore = false, this.currentPage = 1, this.isSearching = false,
  });

  @override
  List<Object?> get props => [journals, hasMore, currentPage, isSearching];
}
class JournalListError extends JournalListState {
  final String message;
  const JournalListError(this.message);
  @override
  List<Object?> get props => [message];
}

// Cubit
class JournalListCubit extends Cubit<JournalListState> {
  final GetJournals _getJournals;
  final SearchJournals _searchJournals;

  JournalListCubit({required GetJournals getJournals, required SearchJournals searchJournals})
      : _getJournals = getJournals,
        _searchJournals = searchJournals,
        super(const JournalListInitial());

  Future<void> loadJournals({bool refresh = false}) async {
    if (refresh || state is JournalListInitial) emit(const JournalListLoading());

    final result = await _getJournals(const GetJournalsParams());
    result.fold(
      (f) => emit(JournalListError(f.message)),
      (data) => emit(JournalListLoaded(
        journals: data.$1,
        hasMore: data.$2?.hasMore ?? false,
        currentPage: 1,
      )),
    );
  }

  Future<void> loadMore() async {
    if (state is! JournalListLoaded) return;
    final current = state as JournalListLoaded;
    if (!current.hasMore) return;

    final nextPage = current.currentPage + 1;
    final result = await _getJournals(GetJournalsParams(page: nextPage));
    result.fold(
      (_) => null, // silently fail on paginate
      (data) => emit(JournalListLoaded(
        journals: [...current.journals, ...data.$1],
        hasMore: data.$2?.hasMore ?? false,
        currentPage: nextPage,
      )),
    );
  }

  Future<void> search(String query) async {
    if (query.isEmpty) {
      loadJournals(refresh: true);
      return;
    }

    emit(const JournalListLoading());
    final result = await _searchJournals(SearchJournalsParams(query));
    result.fold(
      (f) => emit(JournalListError(f.message)),
      (journals) => emit(JournalListLoaded(journals: journals, isSearching: true)),
    );
  }
}
