// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_payment_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VerifyPaymentDto _$VerifyPaymentDtoFromJson(Map<String, dynamic> json) =>
    VerifyPaymentDto(
      razorpayPaymentId: json['razorpay_payment_id'] as String,
      razorpaySubscriptionId: json['razorpay_subscription_id'] as String,
      razorpaySignature: json['razorpay_signature'] as String,
    );

Map<String, dynamic> _$VerifyPaymentDtoToJson(VerifyPaymentDto instance) =>
    <String, dynamic>{
      'razorpay_payment_id': instance.razorpayPaymentId,
      'razorpay_subscription_id': instance.razorpaySubscriptionId,
      'razorpay_signature': instance.razorpaySignature,
    };
