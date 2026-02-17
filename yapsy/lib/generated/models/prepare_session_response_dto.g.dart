// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'prepare_session_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PrepareSessionResponseDto _$PrepareSessionResponseDtoFromJson(
  Map<String, dynamic> json,
) => PrepareSessionResponseDto(
  signedUrl: json['signed_url'] as String,
  sessionConfig: json['session_config'],
);

Map<String, dynamic> _$PrepareSessionResponseDtoToJson(
  PrepareSessionResponseDto instance,
) => <String, dynamic>{
  'signed_url': instance.signedUrl,
  'session_config': instance.sessionConfig,
};
