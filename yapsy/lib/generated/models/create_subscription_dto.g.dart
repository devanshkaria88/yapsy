// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_subscription_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateSubscriptionDto _$CreateSubscriptionDtoFromJson(
  Map<String, dynamic> json,
) => CreateSubscriptionDto(
  planId: json['plan_id'] as String,
  promoCode: json['promo_code'] as String?,
);

Map<String, dynamic> _$CreateSubscriptionDtoToJson(
  CreateSubscriptionDto instance,
) => <String, dynamic>{
  'plan_id': instance.planId,
  'promo_code': instance.promoCode,
};
