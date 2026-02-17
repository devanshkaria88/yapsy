// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_api_v1_mobile_journals_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GetApiV1MobileJournalsResponse _$GetApiV1MobileJournalsResponseFromJson(
  Map<String, dynamic> json,
) => GetApiV1MobileJournalsResponse(
  items: (json['items'] as List<dynamic>?)
      ?.map((e) => JournalResponseDto.fromJson(e as Map<String, dynamic>))
      .toList(),
  meta: json['meta'] == null
      ? null
      : Meta3.fromJson(json['meta'] as Map<String, dynamic>),
);

Map<String, dynamic> _$GetApiV1MobileJournalsResponseToJson(
  GetApiV1MobileJournalsResponse instance,
) => <String, dynamic>{'items': instance.items, 'meta': instance.meta};
