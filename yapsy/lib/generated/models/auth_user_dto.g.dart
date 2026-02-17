// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_user_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthUserDto _$AuthUserDtoFromJson(Map<String, dynamic> json) => AuthUserDto(
  id: json['id'] as String,
  email: json['email'] as String,
  name: json['name'],
  avatarUrl: json['avatar_url'],
  subscriptionStatus: AuthUserDtoSubscriptionStatus.fromJson(
    json['subscription_status'] as String,
  ),
  isOnboarded: json['is_onboarded'] as bool,
  gender: json['gender'] == null
      ? null
      : AuthUserDtoGender.fromJson(json['gender'] as String),
  dateOfBirth: json['date_of_birth'],
);

Map<String, dynamic> _$AuthUserDtoToJson(AuthUserDto instance) =>
    <String, dynamic>{
      'id': instance.id,
      'email': instance.email,
      'name': instance.name,
      'avatar_url': instance.avatarUrl,
      'subscription_status': instance.subscriptionStatus,
      'is_onboarded': instance.isOnboarded,
      'gender': instance.gender,
      'date_of_birth': instance.dateOfBirth,
    };
