// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'journal_response_dto.dart';
import 'meta4.dart';

part 'get_api_v1_mobile_journals_search_response.g.dart';

@JsonSerializable()
class GetApiV1MobileJournalsSearchResponse {
  const GetApiV1MobileJournalsSearchResponse({
    this.items,
    this.meta,
  });
  
  factory GetApiV1MobileJournalsSearchResponse.fromJson(Map<String, Object?> json) => _$GetApiV1MobileJournalsSearchResponseFromJson(json);
  
  final List<JournalResponseDto>? items;
  final Meta4? meta;

  Map<String, Object?> toJson() => _$GetApiV1MobileJournalsSearchResponseToJson(this);
}
