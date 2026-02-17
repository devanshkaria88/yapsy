// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'task_response_dto.dart';
import 'meta.dart';

part 'get_api_v1_mobile_tasks_response.g.dart';

@JsonSerializable()
class GetApiV1MobileTasksResponse {
  const GetApiV1MobileTasksResponse({
    this.items,
    this.meta,
  });
  
  factory GetApiV1MobileTasksResponse.fromJson(Map<String, Object?> json) => _$GetApiV1MobileTasksResponseFromJson(json);
  
  final List<TaskResponseDto>? items;
  final Meta? meta;

  Map<String, Object?> toJson() => _$GetApiV1MobileTasksResponseToJson(this);
}
