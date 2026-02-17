import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/journal_entry.dart';
import '../repositories/journal_repository.dart';

class SearchJournals extends UseCase<List<JournalEntry>, SearchJournalsParams> {
  final JournalRepository repository;
  SearchJournals(this.repository);

  @override
  Future<Either<Failure, List<JournalEntry>>> call(SearchJournalsParams params) =>
      repository.searchJournals(params.query);
}

class SearchJournalsParams extends Equatable {
  final String query;
  const SearchJournalsParams(this.query);
  @override
  List<Object?> get props => [query];
}
