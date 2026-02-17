import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/mood_data.dart';

abstract class InsightsRepository {
  Future<Either<Failure, List<MoodChartData>>> getMoodData({String period = '7d'});
  Future<Either<Failure, List<ThemeData>>> getThemes();
  Future<Either<Failure, StreakData>> getStreaks();
  Future<Either<Failure, WeeklyInsight>> getWeeklyInsight();
}
