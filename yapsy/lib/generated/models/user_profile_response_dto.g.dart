// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_profile_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserProfileResponseDto _$UserProfileResponseDtoFromJson(
  Map<String, dynamic> json,
) => UserProfileResponseDto(
  id: json['id'] as String,
  firebaseUid: json['firebase_uid'] as String,
  email: json['email'] as String,
  timezone: json['timezone'] as String,
  isOnboarded: json['is_onboarded'] as bool,
  subscriptionStatus: UserProfileResponseDtoSubscriptionStatus.fromJson(
    json['subscription_status'] as String,
  ),
  currentStreak: json['current_streak'] as num,
  totalCheckIns: json['total_check_ins'] as num,
  weeklyCheckInCount: json['weekly_check_in_count'] as num,
  createdAt: DateTime.parse(json['created_at'] as String),
  updatedAt: DateTime.parse(json['updated_at'] as String),
  name: json['name'],
  avatarUrl: json['avatar_url'],
  authProvider: json['auth_provider'],
  dateOfBirth: json['date_of_birth'],
  gender: json['gender'] == null
      ? null
      : UserProfileResponseDtoGender.fromJson(json['gender'] as String),
  razorpaySubscriptionId: json['razorpay_subscription_id'],
  razorpayCustomerId: json['razorpay_customer_id'],
  weeklyCheckInResetDate: json['weekly_check_in_reset_date'],
  lastCheckInDate: json['last_check_in_date'],
  fcmToken: json['fcm_token'],
);

Map<String, dynamic> _$UserProfileResponseDtoToJson(
  UserProfileResponseDto instance,
) => <String, dynamic>{
  'id': instance.id,
  'firebase_uid': instance.firebaseUid,
  'email': instance.email,
  'name': instance.name,
  'avatar_url': instance.avatarUrl,
  'auth_provider': instance.authProvider,
  'timezone': instance.timezone,
  'is_onboarded': instance.isOnboarded,
  'date_of_birth': instance.dateOfBirth,
  'gender': instance.gender,
  'subscription_status': instance.subscriptionStatus,
  'razorpay_subscription_id': instance.razorpaySubscriptionId,
  'razorpay_customer_id': instance.razorpayCustomerId,
  'current_streak': instance.currentStreak,
  'total_check_ins': instance.totalCheckIns,
  'weekly_check_in_count': instance.weeklyCheckInCount,
  'weekly_check_in_reset_date': instance.weeklyCheckInResetDate,
  'last_check_in_date': instance.lastCheckInDate,
  'fcm_token': instance.fcmToken,
  'created_at': instance.createdAt.toIso8601String(),
  'updated_at': instance.updatedAt.toIso8601String(),
};
