// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subscription_plan_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SubscriptionPlanResponseDto _$SubscriptionPlanResponseDtoFromJson(
  Map<String, dynamic> json,
) => SubscriptionPlanResponseDto(
  id: json['id'] as String,
  name: json['name'] as String,
  priceAmount: json['price_amount'] as num,
  currency: json['currency'] as String,
  interval: SubscriptionPlanResponseDtoInterval.fromJson(
    json['interval'] as String,
  ),
  features: json['features'],
  isActive: json['is_active'] as bool,
  createdAt: DateTime.parse(json['created_at'] as String),
  updatedAt: DateTime.parse(json['updated_at'] as String),
  razorpayPlanId: json['razorpay_plan_id'],
);

Map<String, dynamic> _$SubscriptionPlanResponseDtoToJson(
  SubscriptionPlanResponseDto instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'razorpay_plan_id': instance.razorpayPlanId,
  'price_amount': instance.priceAmount,
  'currency': instance.currency,
  'interval': instance.interval,
  'features': instance.features,
  'is_active': instance.isActive,
  'created_at': instance.createdAt.toIso8601String(),
  'updated_at': instance.updatedAt.toIso8601String(),
};
