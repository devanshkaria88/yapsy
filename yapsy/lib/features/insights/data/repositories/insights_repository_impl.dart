import 'package:dartz/dartz.dart';
import '../../../../core/error/error_handler.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/mood_data.dart';
import '../../domain/repositories/insights_repository.dart';
import '../datasources/insights_remote_datasource.dart';

class InsightsRepositoryImpl implements InsightsRepository {
  final InsightsRemoteDataSource _remote;
  InsightsRepositoryImpl({required InsightsRemoteDataSource remote}) : _remote = remote;

  @override
  Future<Either<Failure, List<MoodChartData>>> getMoodData({String period = '7d'}) async {
    try {
      final data = await _remote.getMoodData(period: period);
      return Right(data.map((m) => MoodChartData(
        date: DateTime.parse(m['date'] as String),
        score: (m['score'] as num).toDouble(),
      )).toList());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, List<ThemeData>>> getThemes() async {
    try {
      final data = await _remote.getThemes();
      return Right(data.map((t) => ThemeData(
        theme: t['theme'] as String? ?? '',
        count: (t['count'] as num?)?.toInt() ?? 0,
      )).toList());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, StreakData>> getStreaks() async {
    try {
      final data = await _remote.getStreaks();
      return Right(StreakData(
        current: data['current'] as int? ?? 0,
        longest: data['longest'] as int? ?? 0,
      ));
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, WeeklyInsight>> getWeeklyInsight() async {
    try {
      final data = await _remote.getWeeklyInsight();
      return Right(WeeklyInsight(
        summary: data['summary'] as String? ?? '',
        highlights: (data['highlights'] as List?)?.map((e) => e.toString()).toList() ?? [],
        suggestion: data['suggestion'] as String?,
      ));
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }
}
