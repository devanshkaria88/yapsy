// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_api_v1_mobile_tasks_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GetApiV1MobileTasksResponse _$GetApiV1MobileTasksResponseFromJson(
  Map<String, dynamic> json,
) => GetApiV1MobileTasksResponse(
  items: (json['items'] as List<dynamic>?)
      ?.map((e) => TaskResponseDto.fromJson(e as Map<String, dynamic>))
      .toList(),
  meta: json['meta'] == null
      ? null
      : Meta.fromJson(json['meta'] as Map<String, dynamic>),
);

Map<String, dynamic> _$GetApiV1MobileTasksResponseToJson(
  GetApiV1MobileTasksResponse instance,
) => <String, dynamic>{'items': instance.items, 'meta': instance.meta};
