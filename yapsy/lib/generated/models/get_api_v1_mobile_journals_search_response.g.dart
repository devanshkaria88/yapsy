// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'get_api_v1_mobile_journals_search_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GetApiV1MobileJournalsSearchResponse
_$GetApiV1MobileJournalsSearchResponseFromJson(Map<String, dynamic> json) =>
    GetApiV1MobileJournalsSearchResponse(
      items: (json['items'] as List<dynamic>?)
          ?.map((e) => JournalResponseDto.fromJson(e as Map<String, dynamic>))
          .toList(),
      meta: json['meta'] == null
          ? null
          : Meta4.fromJson(json['meta'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$GetApiV1MobileJournalsSearchResponseToJson(
  GetApiV1MobileJournalsSearchResponse instance,
) => <String, dynamic>{'items': instance.items, 'meta': instance.meta};
