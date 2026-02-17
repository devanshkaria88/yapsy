import 'package:equatable/equatable.dart';

class MoodChartData extends Equatable {
  final DateTime date;
  final double score;
  const MoodChartData({required this.date, required this.score});
  @override
  List<Object?> get props => [date, score];
}

class ThemeData extends Equatable {
  final String theme;
  final int count;
  const ThemeData({required this.theme, required this.count});
  @override
  List<Object?> get props => [theme, count];
}

class StreakData extends Equatable {
  final int current;
  final int longest;
  const StreakData({required this.current, required this.longest});
  @override
  List<Object?> get props => [current, longest];
}

class WeeklyInsight extends Equatable {
  final String summary;
  final List<String> highlights;
  final String? suggestion;
  const WeeklyInsight({required this.summary, this.highlights = const [], this.suggestion});
  @override
  List<Object?> get props => [summary, highlights, suggestion];
}
