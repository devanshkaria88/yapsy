// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'verify_payment_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VerifyPaymentResponseDto _$VerifyPaymentResponseDtoFromJson(
  Map<String, dynamic> json,
) => VerifyPaymentResponseDto(
  success: json['success'] as bool,
  message: json['message'] as String,
);

Map<String, dynamic> _$VerifyPaymentResponseDtoToJson(
  VerifyPaymentResponseDto instance,
) => <String, dynamic>{
  'success': instance.success,
  'message': instance.message,
};
