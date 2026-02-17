import '../../domain/entities/journal_entry.dart';

class JournalModel {
  final String id;
  final int moodScore;
  final String? moodLabel;
  final String summary;
  final List<String> wins;
  final List<String> struggles;
  final List<String> actionsTaken;
  final List<String> themes;
  final String? transcript;
  final String createdAt;

  const JournalModel({
    required this.id, required this.moodScore, this.moodLabel,
    required this.summary, this.wins = const [], this.struggles = const [],
    this.actionsTaken = const [], this.themes = const [],
    this.transcript, required this.createdAt,
  });

  factory JournalModel.fromJson(Map<String, dynamic> json) {
    return JournalModel(
      id: json['id'] as String,
      moodScore: (json['mood_score'] as num?)?.toInt() ?? 5,
      moodLabel: json['mood_label'] as String?,
      summary: json['summary'] as String? ?? '',
      wins: _toStringList(json['wins']),
      struggles: _toStringList(json['struggles']),
      actionsTaken: _toStringList(json['actions_taken']),
      themes: _toStringList(json['themes']),
      transcript: json['transcript'] as String?,
      createdAt: json['created_at'] as String,
    );
  }

  JournalEntry toEntity() => JournalEntry(
    id: id, moodScore: moodScore, moodLabel: moodLabel,
    summary: summary, wins: wins, struggles: struggles,
    actionsTaken: actionsTaken, themes: themes,
    transcript: transcript, createdAt: DateTime.parse(createdAt),
  );

  static List<String> _toStringList(dynamic val) {
    if (val is List) return val.map((e) => e.toString()).toList();
    return [];
  }
}
