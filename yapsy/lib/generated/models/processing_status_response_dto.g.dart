// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'processing_status_response_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProcessingStatusResponseDto _$ProcessingStatusResponseDtoFromJson(
  Map<String, dynamic> json,
) => ProcessingStatusResponseDto(
  processingStatus: ProcessingStatusResponseDtoProcessingStatus.fromJson(
    json['processing_status'] as String,
  ),
);

Map<String, dynamic> _$ProcessingStatusResponseDtoToJson(
  ProcessingStatusResponseDto instance,
) => <String, dynamic>{'processing_status': instance.processingStatus};
