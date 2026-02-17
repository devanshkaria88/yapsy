import 'package:equatable/equatable.dart';

class JournalEntry extends Equatable {
  final String id;
  final int moodScore;
  final String? moodLabel;
  final String summary;
  final List<String> wins;
  final List<String> struggles;
  final List<String> actionsTaken;
  final List<String> themes;
  final String? transcript;
  final DateTime createdAt;

  const JournalEntry({
    required this.id,
    required this.moodScore,
    this.moodLabel,
    required this.summary,
    this.wins = const [],
    this.struggles = const [],
    this.actionsTaken = const [],
    this.themes = const [],
    this.transcript,
    required this.createdAt,
  });

  @override
  List<Object?> get props => [id, moodScore, summary, createdAt];
}
