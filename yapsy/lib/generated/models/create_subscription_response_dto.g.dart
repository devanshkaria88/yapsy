// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_subscription_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreateSubscriptionResponseDto _$CreateSubscriptionResponseDtoFromJson(
  Map<String, dynamic> json,
) => CreateSubscriptionResponseDto(
  subscriptionId: json['subscription_id'] as String,
  shortUrl: json['short_url'] as String,
  status: json['status'] as String,
);

Map<String, dynamic> _$CreateSubscriptionResponseDtoToJson(
  CreateSubscriptionResponseDto instance,
) => <String, dynamic>{
  'subscription_id': instance.subscriptionId,
  'short_url': instance.shortUrl,
  'status': instance.status,
};
