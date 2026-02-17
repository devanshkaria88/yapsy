// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/journal_response_dto.dart';
import '../models/prepare_session_response_dto.dart';
import '../models/processing_status_response_dto.dart';
import '../models/save_conversation_dto.dart';

part 'conversations_client.g.dart';

@RestApi()
abstract class ConversationsClient {
  factory ConversationsClient(Dio dio, {String? baseUrl}) = _ConversationsClient;

  /// Prepare a voice session (signed URL + config)
  @GET('/api/v1/mobile/conversations/prepare')
  Future<PrepareSessionResponseDto> mobileConversationsControllerPrepare();

  /// Save a conversation and create journal entry
  @POST('/api/v1/mobile/conversations')
  Future<JournalResponseDto> mobileConversationsControllerSaveConversation({
    @Body() required SaveConversationDto body,
  });

  /// Get journal processing status.
  ///
  /// [id] - Journal ID.
  @GET('/api/v1/mobile/conversations/{id}/status')
  Future<ProcessingStatusResponseDto> mobileConversationsControllerGetProcessingStatus({
    @Path('id') required String id,
  });
}
