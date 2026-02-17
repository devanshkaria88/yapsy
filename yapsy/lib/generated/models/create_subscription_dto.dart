// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'create_subscription_dto.g.dart';

@JsonSerializable()
class CreateSubscriptionDto {
  const CreateSubscriptionDto({
    required this.planId,
    this.promoCode,
  });
  
  factory CreateSubscriptionDto.fromJson(Map<String, Object?> json) => _$CreateSubscriptionDtoFromJson(json);
  
  /// Subscription plan UUID
  @JsonKey(name: 'plan_id')
  final String planId;

  /// Promo code for discount
  @JsonKey(name: 'promo_code')
  final String? promoCode;

  Map<String, Object?> toJson() => _$CreateSubscriptionDtoToJson(this);
}
