// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/auth_response_dto.dart';
import '../models/auth_user_dto.dart';
import '../models/firebase_auth_dto.dart';
import '../models/message_response_dto.dart';
import '../models/onboarding_dto.dart';
import '../models/refresh_token_dto.dart';

part 'auth_client.g.dart';

@RestApi()
abstract class AuthClient {
  factory AuthClient(Dio dio, {String? baseUrl}) = _AuthClient;

  /// Authenticate with Firebase.
  ///
  /// Exchange a Firebase ID token (from Google/Apple sign-in) for backend JWT tokens. Creates a new user on first login.
  @POST('/api/v1/mobile/auth/firebase')
  Future<AuthResponseDto> mobileAuthControllerFirebaseAuth({
    @Body() required FirebaseAuthDto body,
  });

  /// Complete onboarding.
  ///
  /// Submit name, date of birth, and gender after first sign-in. Sets is_onboarded to true.
  @POST('/api/v1/mobile/auth/onboard')
  Future<AuthUserDto> mobileAuthControllerOnboard({
    @Body() required OnboardingDto body,
  });

  /// Refresh access token.
  ///
  /// Exchange a valid refresh token for a new token pair.
  @POST('/api/v1/mobile/auth/refresh')
  Future<AuthResponseDto> mobileAuthControllerRefresh({
    @Body() required RefreshTokenDto body,
  });

  /// Logout and invalidate refresh token
  @POST('/api/v1/mobile/auth/logout')
  Future<MessageResponseDto> mobileAuthControllerLogout();
}
