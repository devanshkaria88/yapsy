import 'package:dartz/dartz.dart';
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/note.dart';
import '../repositories/notes_repository.dart';

class CreateNote extends UseCase<Note, CreateNoteParams> {
  final NotesRepository repository;
  CreateNote(this.repository);

  @override
  Future<Either<Failure, Note>> call(CreateNoteParams params) =>
      repository.createNote(params.content);
}

class CreateNoteParams extends Equatable {
  final String content;
  const CreateNoteParams(this.content);
  @override
  List<Object?> get props => [content];
}
