import 'package:dartz/dartz.dart';
import '../../../../core/error/error_handler.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/note.dart';
import '../../domain/repositories/notes_repository.dart';
import '../datasources/notes_remote_datasource.dart';
import '../models/note_model.dart';

class NotesRepositoryImpl implements NotesRepository {
  final NotesRemoteDataSource _remote;
  NotesRepositoryImpl({required NotesRemoteDataSource remote}) : _remote = remote;

  @override
  Future<Either<Failure, List<Note>>> getNotes() async {
    try {
      final data = await _remote.getNotes();
      return Right(data.map((j) => NoteModel.fromJson(j).toEntity()).toList());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, Note>> createNote(String content) async {
    try {
      final data = await _remote.createNote(content);
      return Right(NoteModel.fromJson(data).toEntity());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, Note>> updateNote({required String id, required String content}) async {
    try {
      final data = await _remote.updateNote(id, content);
      return Right(NoteModel.fromJson(data).toEntity());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, void>> deleteNote(String id) async {
    try {
      await _remote.deleteNote(id);
      return const Right(null);
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }
}
