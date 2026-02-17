import 'package:equatable/equatable.dart';
import '../../../tasks/domain/entities/task.dart';

/// Aggregated dashboard data.
class DashboardData extends Equatable {
  final List<Task> todayTasks;
  final List<Task> overdueTasks;
  final int currentStreak;
  final int longestStreak;
  final List<MoodPoint> recentMoods;
  final List<String> themes;
  final String? weeklyInsight;
  final int? todayMoodScore;

  const DashboardData({
    this.todayTasks = const [],
    this.overdueTasks = const [],
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.recentMoods = const [],
    this.themes = const [],
    this.weeklyInsight,
    this.todayMoodScore,
  });

  int get pendingTaskCount => todayTasks.where((t) => t.isPending).length;
  int get completedTaskCount => todayTasks.where((t) => t.isCompleted).length;

  @override
  List<Object?> get props => [todayTasks, overdueTasks, currentStreak, longestStreak, recentMoods, themes, weeklyInsight, todayMoodScore];
}

class MoodPoint extends Equatable {
  final DateTime date;
  final double score;

  const MoodPoint({required this.date, required this.score});

  @override
  List<Object?> get props => [date, score];
}
