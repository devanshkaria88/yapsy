import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/api/api_response.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/journal_entry.dart';
import '../repositories/journal_repository.dart';

class GetJournals extends UseCase<(List<JournalEntry>, PaginationMeta?), GetJournalsParams> {
  final JournalRepository repository;
  GetJournals(this.repository);

  @override
  Future<Either<Failure, (List<JournalEntry>, PaginationMeta?)>> call(GetJournalsParams params) =>
      repository.getJournals(page: params.page, limit: params.limit);
}

class GetJournalsParams extends Equatable {
  final int page;
  final int limit;
  const GetJournalsParams({this.page = 1, this.limit = 20});
  @override
  List<Object?> get props => [page, limit];
}
