import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/journal_entry.dart';
import '../repositories/journal_repository.dart';

class GetJournalDetail extends UseCase<JournalEntry, JournalDetailParams> {
  final JournalRepository repository;
  GetJournalDetail(this.repository);

  @override
  Future<Either<Failure, JournalEntry>> call(JournalDetailParams params) =>
      repository.getJournalDetail(params.id);
}

class JournalDetailParams extends Equatable {
  final String id;
  const JournalDetailParams(this.id);
  @override
  List<Object?> get props => [id];
}
