// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subscription_status_plan_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SubscriptionStatusPlanDto _$SubscriptionStatusPlanDtoFromJson(
  Map<String, dynamic> json,
) => SubscriptionStatusPlanDto(
  id: json['id'] as String,
  name: json['name'] as String,
  priceAmount: json['price_amount'] as num,
  currency: json['currency'] as String,
  interval: SubscriptionStatusPlanDtoInterval.fromJson(
    json['interval'] as String,
  ),
  features: json['features'],
);

Map<String, dynamic> _$SubscriptionStatusPlanDtoToJson(
  SubscriptionStatusPlanDto instance,
) => <String, dynamic>{
  'id': instance.id,
  'name': instance.name,
  'price_amount': instance.priceAmount,
  'currency': instance.currency,
  'interval': instance.interval,
  'features': instance.features,
};
