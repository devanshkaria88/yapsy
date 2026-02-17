import 'package:dartz/dartz.dart';
import '../../../../core/error/error_handler.dart';
import '../../../../core/error/failures.dart';
import '../../../tasks/data/models/task_model.dart';
import '../../domain/entities/dashboard_data.dart';
import '../../domain/repositories/home_repository.dart';
import '../datasources/home_remote_datasource.dart';

class HomeRepositoryImpl implements HomeRepository {
  final HomeRemoteDataSource _remote;
  HomeRepositoryImpl({required HomeRemoteDataSource remote}) : _remote = remote;

  @override
  Future<Either<Failure, DashboardData>> getDashboardData() async {
    try {
      // Fetch all dashboard data concurrently
      final results = await Future.wait([
        _remote.getTodayTasks(),
        _remote.getOverdueTasks(),
        _remote.getStreaks(),
        _remote.getMoodData(),
        _remote.getThemes(),
        _remote.getTodayJournal(),
      ]);

      final todayTasksJson = results[0] as List<Map<String, dynamic>>;
      final overdueTasksJson = results[1] as List<Map<String, dynamic>>;
      final streaks = results[2] as Map<String, dynamic>;
      final moodsJson = results[3] as List<Map<String, dynamic>>;
      final themes = results[4] as List<String>;
      final todayJournal = results[5] as Map<String, dynamic>?;

      final todayTasks = todayTasksJson.map((j) => TaskModel.fromJson(j).toEntity()).toList();
      final overdueTasks = overdueTasksJson.map((j) => TaskModel.fromJson(j).toEntity()).toList();

      final recentMoods = moodsJson.map((m) {
        return MoodPoint(
          date: DateTime.parse(m['date'] as String),
          score: (m['score'] as num).toDouble(),
        );
      }).toList();

      final todayMood = todayJournal?['mood_score'] as num?;

      return Right(DashboardData(
        todayTasks: todayTasks,
        overdueTasks: overdueTasks,
        currentStreak: streaks['current'] as int? ?? 0,
        longestStreak: streaks['longest'] as int? ?? 0,
        recentMoods: recentMoods,
        themes: themes,
        todayMoodScore: todayMood?.toInt(),
      ));
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }
}
