import 'package:dartz/dartz.dart';
import '../../../../core/api/api_response.dart';
import '../../../../core/error/error_handler.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/journal_entry.dart';
import '../../domain/repositories/journal_repository.dart';
import '../datasources/journal_remote_datasource.dart';
import '../models/journal_model.dart';

class JournalRepositoryImpl implements JournalRepository {
  final JournalRemoteDataSource _remote;
  JournalRepositoryImpl({required JournalRemoteDataSource remote}) : _remote = remote;

  @override
  Future<Either<Failure, (List<JournalEntry>, PaginationMeta?)>> getJournals({int page = 1, int limit = 20}) async {
    try {
      final response = await _remote.getJournals(page: page, limit: limit);
      final data = response['data'] as List?;
      final journals = (data ?? []).map((j) => JournalModel.fromJson(j as Map<String, dynamic>).toEntity()).toList();
      final meta = response['meta'] != null ? PaginationMeta.fromJson(response['meta'] as Map<String, dynamic>) : null;
      return Right((journals, meta));
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, JournalEntry>> getJournalDetail(String id) async {
    try {
      final data = await _remote.getJournalDetail(id);
      return Right(JournalModel.fromJson(data).toEntity());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, JournalEntry?>> getTodayJournal() async {
    try {
      final data = await _remote.getTodayJournal();
      if (data == null) return const Right(null);
      return Right(JournalModel.fromJson(data).toEntity());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, List<JournalEntry>>> searchJournals(String query) async {
    try {
      final data = await _remote.searchJournals(query);
      return Right(data.map((j) => JournalModel.fromJson(j).toEntity()).toList());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }
}
