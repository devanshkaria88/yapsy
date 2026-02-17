// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'journal_response_dto.dart';
import 'meta3.dart';

part 'get_api_v1_mobile_journals_response.g.dart';

@JsonSerializable()
class GetApiV1MobileJournalsResponse {
  const GetApiV1MobileJournalsResponse({
    this.items,
    this.meta,
  });
  
  factory GetApiV1MobileJournalsResponse.fromJson(Map<String, Object?> json) => _$GetApiV1MobileJournalsResponseFromJson(json);
  
  final List<JournalResponseDto>? items;
  final Meta3? meta;

  Map<String, Object?> toJson() => _$GetApiV1MobileJournalsResponseToJson(this);
}
