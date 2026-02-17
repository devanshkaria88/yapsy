// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'processing_status_response_dto_processing_status.dart';

part 'processing_status_response_dto.g.dart';

@JsonSerializable()
class ProcessingStatusResponseDto {
  const ProcessingStatusResponseDto({
    required this.processingStatus,
  });
  
  factory ProcessingStatusResponseDto.fromJson(Map<String, Object?> json) => _$ProcessingStatusResponseDtoFromJson(json);
  
  @JsonKey(name: 'processing_status')
  final ProcessingStatusResponseDtoProcessingStatus processingStatus;

  Map<String, Object?> toJson() => _$ProcessingStatusResponseDtoToJson(this);
}
