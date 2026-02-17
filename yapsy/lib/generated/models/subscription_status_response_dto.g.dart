// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subscription_status_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SubscriptionStatusResponseDto _$SubscriptionStatusResponseDtoFromJson(
  Map<String, dynamic> json,
) => SubscriptionStatusResponseDto(
  subscriptionStatus: SubscriptionStatusResponseDtoSubscriptionStatus.fromJson(
    json['subscription_status'] as String,
  ),
  razorpaySubscriptionId: json['razorpay_subscription_id'],
  plan: json['plan'] == null
      ? null
      : SubscriptionStatusPlanDto.fromJson(
          json['plan'] as Map<String, dynamic>,
        ),
);

Map<String, dynamic> _$SubscriptionStatusResponseDtoToJson(
  SubscriptionStatusResponseDto instance,
) => <String, dynamic>{
  'subscription_status': instance.subscriptionStatus,
  'razorpay_subscription_id': instance.razorpaySubscriptionId,
  'plan': instance.plan,
};
