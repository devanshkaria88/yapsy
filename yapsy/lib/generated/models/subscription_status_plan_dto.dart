// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'subscription_status_plan_dto_interval.dart';

part 'subscription_status_plan_dto.g.dart';

@JsonSerializable()
class SubscriptionStatusPlanDto {
  const SubscriptionStatusPlanDto({
    required this.id,
    required this.name,
    required this.priceAmount,
    required this.currency,
    required this.interval,
    required this.features,
  });
  
  factory SubscriptionStatusPlanDto.fromJson(Map<String, Object?> json) => _$SubscriptionStatusPlanDtoFromJson(json);
  
  final String id;
  final String name;
  @JsonKey(name: 'price_amount')
  final num priceAmount;
  final String currency;
  final SubscriptionStatusPlanDtoInterval interval;
  final dynamic features;

  Map<String, Object?> toJson() => _$SubscriptionStatusPlanDtoToJson(this);
}
