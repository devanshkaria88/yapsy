// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'user_profile_response_dto_gender.dart';
import 'user_profile_response_dto_subscription_status.dart';

part 'user_profile_response_dto.g.dart';

@JsonSerializable()
class UserProfileResponseDto {
  const UserProfileResponseDto({
    required this.id,
    required this.firebaseUid,
    required this.email,
    required this.timezone,
    required this.isOnboarded,
    required this.subscriptionStatus,
    required this.currentStreak,
    required this.totalCheckIns,
    required this.weeklyCheckInCount,
    required this.createdAt,
    required this.updatedAt,
    this.name,
    this.avatarUrl,
    this.authProvider,
    this.dateOfBirth,
    this.gender,
    this.razorpaySubscriptionId,
    this.razorpayCustomerId,
    this.weeklyCheckInResetDate,
    this.lastCheckInDate,
    this.fcmToken,
  });
  
  factory UserProfileResponseDto.fromJson(Map<String, Object?> json) => _$UserProfileResponseDtoFromJson(json);
  
  final String id;
  @JsonKey(name: 'firebase_uid')
  final String firebaseUid;
  final String email;
  final dynamic name;
  @JsonKey(name: 'avatar_url')
  final dynamic avatarUrl;
  @JsonKey(name: 'auth_provider')
  final dynamic authProvider;
  final String timezone;
  @JsonKey(name: 'is_onboarded')
  final bool isOnboarded;
  @JsonKey(name: 'date_of_birth')
  final dynamic dateOfBirth;
  final UserProfileResponseDtoGender? gender;
  @JsonKey(name: 'subscription_status')
  final UserProfileResponseDtoSubscriptionStatus subscriptionStatus;
  @JsonKey(name: 'razorpay_subscription_id')
  final dynamic razorpaySubscriptionId;
  @JsonKey(name: 'razorpay_customer_id')
  final dynamic razorpayCustomerId;
  @JsonKey(name: 'current_streak')
  final num currentStreak;
  @JsonKey(name: 'total_check_ins')
  final num totalCheckIns;
  @JsonKey(name: 'weekly_check_in_count')
  final num weeklyCheckInCount;
  @JsonKey(name: 'weekly_check_in_reset_date')
  final dynamic weeklyCheckInResetDate;
  @JsonKey(name: 'last_check_in_date')
  final dynamic lastCheckInDate;
  @JsonKey(name: 'fcm_token')
  final dynamic fcmToken;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  Map<String, Object?> toJson() => _$UserProfileResponseDtoToJson(this);
}
