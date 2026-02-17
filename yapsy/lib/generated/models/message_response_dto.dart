// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'message_response_dto.g.dart';

@JsonSerializable()
class MessageResponseDto {
  const MessageResponseDto({
    required this.message,
  });
  
  factory MessageResponseDto.fromJson(Map<String, Object?> json) => _$MessageResponseDtoFromJson(json);
  
  final String message;

  Map<String, Object?> toJson() => _$MessageResponseDtoToJson(this);
}
