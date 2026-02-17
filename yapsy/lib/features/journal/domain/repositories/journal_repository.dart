import 'package:dartz/dartz.dart';
import '../../../../core/api/api_response.dart';
import '../../../../core/error/failures.dart';
import '../entities/journal_entry.dart';

abstract class JournalRepository {
  Future<Either<Failure, (List<JournalEntry>, PaginationMeta?)>> getJournals({int page = 1, int limit = 20});
  Future<Either<Failure, JournalEntry>> getJournalDetail(String id);
  Future<Either<Failure, JournalEntry?>> getTodayJournal();
  Future<Either<Failure, List<JournalEntry>>> searchJournals(String query);
}
