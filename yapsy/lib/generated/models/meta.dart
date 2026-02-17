// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'meta.g.dart';

@JsonSerializable()
class Meta {
  const Meta({
    this.page,
    this.limit,
    this.total,
    this.hasMore,
  });
  
  factory Meta.fromJson(Map<String, Object?> json) => _$MetaFromJson(json);
  
  final num? page;
  final num? limit;
  final num? total;
  final bool? hasMore;

  Map<String, Object?> toJson() => _$MetaToJson(this);
}
