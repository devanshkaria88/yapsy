// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/message_response_dto.dart';
import '../models/update_fcm_token_dto.dart';
import '../models/update_user_dto.dart';
import '../models/user_profile_response_dto.dart';

part 'users_client.g.dart';

@RestApi()
abstract class UsersClient {
  factory UsersClient(Dio dio, {String? baseUrl}) = _UsersClient;

  /// Get current user profile
  @GET('/api/v1/mobile/users/me')
  Future<UserProfileResponseDto> mobileUsersControllerGetProfile();

  /// Update current user profile
  @PATCH('/api/v1/mobile/users/me')
  Future<UserProfileResponseDto> mobileUsersControllerUpdateProfile({
    @Body() required UpdateUserDto body,
  });

  /// Delete account (soft delete)
  @DELETE('/api/v1/mobile/users/me')
  Future<MessageResponseDto> mobileUsersControllerDeleteAccount();

  /// Update FCM token for push notifications
  @PATCH('/api/v1/mobile/users/me/fcm-token')
  Future<MessageResponseDto> mobileUsersControllerUpdateFcmToken({
    @Body() required UpdateFcmTokenDto body,
  });
}
