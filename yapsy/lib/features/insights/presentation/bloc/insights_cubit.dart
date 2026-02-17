import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/mood_data.dart';
import '../../domain/repositories/insights_repository.dart';

abstract class InsightsState extends Equatable {
  const InsightsState();
  @override
  List<Object?> get props => [];
}

class InsightsInitial extends InsightsState { const InsightsInitial(); }
class InsightsLoading extends InsightsState { const InsightsLoading(); }
class InsightsLoaded extends InsightsState {
  final List<MoodChartData> moodData;
  final List<ThemeData> themes;
  final StreakData streaks;
  final WeeklyInsight? weeklyInsight;
  final String moodPeriod;

  const InsightsLoaded({
    required this.moodData, required this.themes, required this.streaks,
    this.weeklyInsight, this.moodPeriod = '7d',
  });

  InsightsLoaded copyWith({List<MoodChartData>? moodData, String? moodPeriod}) => InsightsLoaded(
    moodData: moodData ?? this.moodData,
    themes: themes, streaks: streaks, weeklyInsight: weeklyInsight,
    moodPeriod: moodPeriod ?? this.moodPeriod,
  );

  @override
  List<Object?> get props => [moodData, themes, streaks, weeklyInsight, moodPeriod];
}

class InsightsError extends InsightsState {
  final String message;
  const InsightsError(this.message);
  @override
  List<Object?> get props => [message];
}

class InsightsCubit extends Cubit<InsightsState> {
  final InsightsRepository _repository;

  InsightsCubit({required InsightsRepository repository})
      : _repository = repository,
        super(const InsightsInitial());

  Future<void> load() async {
    emit(const InsightsLoading());
    final results = await Future.wait([
      _repository.getMoodData(),
      _repository.getThemes(),
      _repository.getStreaks(),
      _repository.getWeeklyInsight(),
    ]);

    final moodResult = results[0] as dynamic;
    final themesResult = results[1] as dynamic;
    final streaksResult = results[2] as dynamic;
    final weeklyResult = results[3] as dynamic;

    // Check for critical failures
    if (streaksResult.isLeft()) {
      streaksResult.fold((f) => emit(InsightsError(f.message)), (_) {});
      return;
    }

    final moods = moodResult.fold((_) => <MoodChartData>[], (d) => d as List<MoodChartData>);
    final themes = themesResult.fold((_) => <ThemeData>[], (d) => d as List<ThemeData>);
    final streaks = streaksResult.fold((_) => const StreakData(current: 0, longest: 0), (d) => d as StreakData);
    final weekly = weeklyResult.fold((_) => null, (d) => d as WeeklyInsight?);

    emit(InsightsLoaded(moodData: moods, themes: themes, streaks: streaks, weeklyInsight: weekly));
  }

  Future<void> changeMoodPeriod(String period) async {
    if (state is! InsightsLoaded) return;
    final result = await _repository.getMoodData(period: period);
    result.fold(
      (_) => null,
      (data) => emit((state as InsightsLoaded).copyWith(moodData: data, moodPeriod: period)),
    );
  }
}
