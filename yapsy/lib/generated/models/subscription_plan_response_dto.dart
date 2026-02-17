// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'subscription_plan_response_dto_interval.dart';

part 'subscription_plan_response_dto.g.dart';

@JsonSerializable()
class SubscriptionPlanResponseDto {
  const SubscriptionPlanResponseDto({
    required this.id,
    required this.name,
    required this.priceAmount,
    required this.currency,
    required this.interval,
    required this.features,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
    this.razorpayPlanId,
  });
  
  factory SubscriptionPlanResponseDto.fromJson(Map<String, Object?> json) => _$SubscriptionPlanResponseDtoFromJson(json);
  
  final String id;
  final String name;
  @JsonKey(name: 'razorpay_plan_id')
  final dynamic razorpayPlanId;

  /// Price in paise
  @JsonKey(name: 'price_amount')
  final num priceAmount;
  final String currency;
  final SubscriptionPlanResponseDtoInterval interval;
  final dynamic features;
  @JsonKey(name: 'is_active')
  final bool isActive;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  Map<String, Object?> toJson() => _$SubscriptionPlanResponseDtoToJson(this);
}
