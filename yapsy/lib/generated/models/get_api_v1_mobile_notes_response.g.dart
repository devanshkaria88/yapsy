// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_api_v1_mobile_notes_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GetApiV1MobileNotesResponse _$GetApiV1MobileNotesResponseFromJson(
  Map<String, dynamic> json,
) => GetApiV1MobileNotesResponse(
  items: (json['items'] as List<dynamic>?)
      ?.map((e) => NoteResponseDto.fromJson(e as Map<String, dynamic>))
      .toList(),
  meta: json['meta'] == null
      ? null
      : Meta2.fromJson(json['meta'] as Map<String, dynamic>),
);

Map<String, dynamic> _$GetApiV1MobileNotesResponseToJson(
  GetApiV1MobileNotesResponse instance,
) => <String, dynamic>{'items': instance.items, 'meta': instance.meta};
