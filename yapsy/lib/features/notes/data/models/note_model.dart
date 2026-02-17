import '../../domain/entities/note.dart';

class NoteModel {
  final String id;
  final String content;
  final String? journalId;
  final String createdAt;
  final String updatedAt;

  const NoteModel({required this.id, required this.content, this.journalId, required this.createdAt, required this.updatedAt});

  factory NoteModel.fromJson(Map<String, dynamic> json) => NoteModel(
    id: json['id'] as String,
    content: json['content'] as String,
    journalId: json['journal_id'] as String?,
    createdAt: json['created_at'] as String,
    updatedAt: json['updated_at'] as String,
  );

  Note toEntity() => Note(
    id: id, content: content, journalId: journalId,
    createdAt: DateTime.parse(createdAt), updatedAt: DateTime.parse(updatedAt),
  );
}
