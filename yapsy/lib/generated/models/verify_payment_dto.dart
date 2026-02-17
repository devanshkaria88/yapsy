// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'verify_payment_dto.g.dart';

@JsonSerializable()
class VerifyPaymentDto {
  const VerifyPaymentDto({
    required this.razorpayPaymentId,
    required this.razorpaySubscriptionId,
    required this.razorpaySignature,
  });
  
  factory VerifyPaymentDto.fromJson(Map<String, Object?> json) => _$VerifyPaymentDtoFromJson(json);
  
  /// Razorpay payment ID
  @JsonKey(name: 'razorpay_payment_id')
  final String razorpayPaymentId;

  /// Razorpay subscription ID
  @JsonKey(name: 'razorpay_subscription_id')
  final String razorpaySubscriptionId;

  /// Razorpay signature for verification
  @JsonKey(name: 'razorpay_signature')
  final String razorpaySignature;

  Map<String, Object?> toJson() => _$VerifyPaymentDtoToJson(this);
}
