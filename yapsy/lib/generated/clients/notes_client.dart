// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/create_note_dto.dart';
import '../models/get_api_v1_mobile_notes_response.dart';
import '../models/message_response_dto.dart';
import '../models/note_response_dto.dart';
import '../models/source.dart';
import '../models/update_note_dto.dart';

part 'notes_client.g.dart';

@RestApi()
abstract class NotesClient {
  factory NotesClient(Dio dio, {String? baseUrl}) = _NotesClient;

  /// Get all notes with pagination and filters.
  ///
  /// [isResolved] - Filter by resolved status.
  ///
  /// [source] - Filter by source.
  @GET('/api/v1/mobile/notes')
  Future<GetApiV1MobileNotesResponse> mobileNotesControllerFindAll({
    @Query('is_resolved') bool? isResolved,
    @Query('source') Source? source,
    @Query('page') num? page = 1,
    @Query('limit') num? limit = 20,
  });

  /// Create a new note
  @POST('/api/v1/mobile/notes')
  Future<NoteResponseDto> mobileNotesControllerCreate({
    @Body() required CreateNoteDto body,
  });

  /// Update a note.
  ///
  /// [id] - Note ID.
  @PATCH('/api/v1/mobile/notes/{id}')
  Future<NoteResponseDto> mobileNotesControllerUpdate({
    @Path('id') required String id,
    @Body() required UpdateNoteDto body,
  });

  /// Delete a note.
  ///
  /// [id] - Note ID.
  @DELETE('/api/v1/mobile/notes/{id}')
  Future<MessageResponseDto> mobileNotesControllerRemove({
    @Path('id') required String id,
  });
}
