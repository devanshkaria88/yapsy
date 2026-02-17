import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/note.dart';
import '../repositories/notes_repository.dart';

class UpdateNote extends UseCase<Note, UpdateNoteParams> {
  final NotesRepository repository;
  UpdateNote(this.repository);

  @override
  Future<Either<Failure, Note>> call(UpdateNoteParams params) =>
      repository.updateNote(id: params.id, content: params.content);
}

class UpdateNoteParams extends Equatable {
  final String id;
  final String content;
  const UpdateNoteParams({required this.id, required this.content});
  @override
  List<Object?> get props => [id, content];
}
