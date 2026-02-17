// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'cancel_subscription_response_dto.g.dart';

@JsonSerializable()
class CancelSubscriptionResponseDto {
  const CancelSubscriptionResponseDto({
    required this.success,
    required this.message,
  });
  
  factory CancelSubscriptionResponseDto.fromJson(Map<String, Object?> json) => _$CancelSubscriptionResponseDtoFromJson(json);
  
  final bool success;
  final String message;

  Map<String, Object?> toJson() => _$CancelSubscriptionResponseDtoToJson(this);
}
