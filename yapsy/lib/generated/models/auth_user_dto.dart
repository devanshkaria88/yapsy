// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'auth_user_dto_gender.dart';
import 'auth_user_dto_subscription_status.dart';

part 'auth_user_dto.g.dart';

@JsonSerializable()
class AuthUserDto {
  const AuthUserDto({
    required this.id,
    required this.email,
    required this.name,
    required this.avatarUrl,
    required this.subscriptionStatus,
    required this.isOnboarded,
    required this.gender,
    required this.dateOfBirth,
  });
  
  factory AuthUserDto.fromJson(Map<String, Object?> json) => _$AuthUserDtoFromJson(json);
  
  final String id;
  final String email;
  final dynamic name;
  @JsonKey(name: 'avatar_url')
  final dynamic avatarUrl;
  @JsonKey(name: 'subscription_status')
  final AuthUserDtoSubscriptionStatus subscriptionStatus;

  /// Whether the user has completed onboarding
  @JsonKey(name: 'is_onboarded')
  final bool isOnboarded;
  final AuthUserDtoGender? gender;
  @JsonKey(name: 'date_of_birth')
  final dynamic dateOfBirth;

  Map<String, Object?> toJson() => _$AuthUserDtoToJson(this);
}
