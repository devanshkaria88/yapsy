// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cancel_subscription_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CancelSubscriptionResponseDto _$CancelSubscriptionResponseDtoFromJson(
  Map<String, dynamic> json,
) => CancelSubscriptionResponseDto(
  success: json['success'] as bool,
  message: json['message'] as String,
);

Map<String, dynamic> _$CancelSubscriptionResponseDtoToJson(
  CancelSubscriptionResponseDto instance,
) => <String, dynamic>{
  'success': instance.success,
  'message': instance.message,
};
