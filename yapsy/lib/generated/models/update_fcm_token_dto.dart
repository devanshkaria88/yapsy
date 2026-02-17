// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'update_fcm_token_dto.g.dart';

@JsonSerializable()
class UpdateFcmTokenDto {
  const UpdateFcmTokenDto({
    required this.fcmToken,
  });
  
  factory UpdateFcmTokenDto.fromJson(Map<String, Object?> json) => _$UpdateFcmTokenDtoFromJson(json);
  
  /// Firebase Cloud Messaging token for push notifications
  @JsonKey(name: 'fcm_token')
  final String fcmToken;

  Map<String, Object?> toJson() => _$UpdateFcmTokenDtoToJson(this);
}
