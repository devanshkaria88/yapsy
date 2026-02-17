// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'theme_count_dto.g.dart';

@JsonSerializable()
class ThemeCountDto {
  const ThemeCountDto({
    required this.theme,
    required this.count,
  });
  
  factory ThemeCountDto.fromJson(Map<String, Object?> json) => _$ThemeCountDtoFromJson(json);
  
  final String theme;
  final num count;

  Map<String, Object?> toJson() => _$ThemeCountDtoToJson(this);
}
