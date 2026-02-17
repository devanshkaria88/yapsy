// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'prepare_session_response_dto.g.dart';

@JsonSerializable()
class PrepareSessionResponseDto {
  const PrepareSessionResponseDto({
    required this.signedUrl,
    required this.sessionConfig,
  });
  
  factory PrepareSessionResponseDto.fromJson(Map<String, Object?> json) => _$PrepareSessionResponseDtoFromJson(json);
  
  @JsonKey(name: 'signed_url')
  final String signedUrl;
  @JsonKey(name: 'session_config')
  final dynamic sessionConfig;

  Map<String, Object?> toJson() => _$PrepareSessionResponseDtoToJson(this);
}
