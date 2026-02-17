import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/note.dart';

abstract class NotesRepository {
  Future<Either<Failure, List<Note>>> getNotes();
  Future<Either<Failure, Note>> createNote(String content);
  Future<Either<Failure, Note>> updateNote({required String id, required String content});
  Future<Either<Failure, void>> deleteNote(String id);
}
