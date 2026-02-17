// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'verify_payment_response_dto.g.dart';

@JsonSerializable()
class VerifyPaymentResponseDto {
  const VerifyPaymentResponseDto({
    required this.success,
    required this.message,
  });
  
  factory VerifyPaymentResponseDto.fromJson(Map<String, Object?> json) => _$VerifyPaymentResponseDtoFromJson(json);
  
  final bool success;
  final String message;

  Map<String, Object?> toJson() => _$VerifyPaymentResponseDtoToJson(this);
}
