// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'meta4.g.dart';

@JsonSerializable()
class Meta4 {
  const Meta4({
    this.page,
    this.limit,
    this.total,
    this.hasMore,
  });
  
  factory Meta4.fromJson(Map<String, Object?> json) => _$Meta4FromJson(json);
  
  final num? page;
  final num? limit;
  final num? total;
  final bool? hasMore;

  Map<String, Object?> toJson() => _$Meta4ToJson(this);
}
