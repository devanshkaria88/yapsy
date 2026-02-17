// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'subscription_status_plan_dto.dart';
import 'subscription_status_response_dto_subscription_status.dart';

part 'subscription_status_response_dto.g.dart';

@JsonSerializable()
class SubscriptionStatusResponseDto {
  const SubscriptionStatusResponseDto({
    required this.subscriptionStatus,
    this.razorpaySubscriptionId,
    this.plan,
  });
  
  factory SubscriptionStatusResponseDto.fromJson(Map<String, Object?> json) => _$SubscriptionStatusResponseDtoFromJson(json);
  
  @JsonKey(name: 'subscription_status')
  final SubscriptionStatusResponseDtoSubscriptionStatus subscriptionStatus;
  @JsonKey(name: 'razorpay_subscription_id')
  final dynamic razorpaySubscriptionId;
  final SubscriptionStatusPlanDto? plan;

  Map<String, Object?> toJson() => _$SubscriptionStatusResponseDtoToJson(this);
}
