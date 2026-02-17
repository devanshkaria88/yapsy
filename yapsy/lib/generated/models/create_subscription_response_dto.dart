// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'create_subscription_response_dto.g.dart';

@JsonSerializable()
class CreateSubscriptionResponseDto {
  const CreateSubscriptionResponseDto({
    required this.subscriptionId,
    required this.shortUrl,
    required this.status,
  });
  
  factory CreateSubscriptionResponseDto.fromJson(Map<String, Object?> json) => _$CreateSubscriptionResponseDtoFromJson(json);
  
  @JsonKey(name: 'subscription_id')
  final String subscriptionId;
  @JsonKey(name: 'short_url')
  final String shortUrl;
  final String status;

  Map<String, Object?> toJson() => _$CreateSubscriptionResponseDtoToJson(this);
}
