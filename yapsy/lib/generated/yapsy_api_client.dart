// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';

import 'clients/auth_client.dart';
import 'clients/users_client.dart';
import 'clients/tasks_client.dart';
import 'clients/notes_client.dart';
import 'clients/conversations_client.dart';
import 'clients/journals_client.dart';
import 'clients/insights_client.dart';
import 'clients/subscriptions_client.dart';
import 'clients/promo_client.dart';

/// Yapsy Mobile API `v1.0`.
///
/// API for the Yapsy Flutter mobile application.
class YapsyApiClient {
  YapsyApiClient(
    Dio dio, {
    String? baseUrl,
  })  : _dio = dio,
        _baseUrl = baseUrl;

  final Dio _dio;
  final String? _baseUrl;

  static String get version => '1.0';

  AuthClient? _auth;
  UsersClient? _users;
  TasksClient? _tasks;
  NotesClient? _notes;
  ConversationsClient? _conversations;
  JournalsClient? _journals;
  InsightsClient? _insights;
  SubscriptionsClient? _subscriptions;
  PromoClient? _promo;

  AuthClient get auth => _auth ??= AuthClient(_dio, baseUrl: _baseUrl);

  UsersClient get users => _users ??= UsersClient(_dio, baseUrl: _baseUrl);

  TasksClient get tasks => _tasks ??= TasksClient(_dio, baseUrl: _baseUrl);

  NotesClient get notes => _notes ??= NotesClient(_dio, baseUrl: _baseUrl);

  ConversationsClient get conversations => _conversations ??= ConversationsClient(_dio, baseUrl: _baseUrl);

  JournalsClient get journals => _journals ??= JournalsClient(_dio, baseUrl: _baseUrl);

  InsightsClient get insights => _insights ??= InsightsClient(_dio, baseUrl: _baseUrl);

  SubscriptionsClient get subscriptions => _subscriptions ??= SubscriptionsClient(_dio, baseUrl: _baseUrl);

  PromoClient get promo => _promo ??= PromoClient(_dio, baseUrl: _baseUrl);
}
