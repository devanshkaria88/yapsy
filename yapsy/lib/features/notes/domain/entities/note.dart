import 'package:equatable/equatable.dart';

/// Domain entity for a note.
class Note extends Equatable {
  final String id;
  final String content;
  final String? journalId;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Note({
    required this.id,
    required this.content,
    this.journalId,
    required this.createdAt,
    required this.updatedAt,
  });

  @override
  List<Object?> get props => [id, content, journalId, createdAt, updatedAt];
}
