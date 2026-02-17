// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'update_user_dto.g.dart';

@JsonSerializable()
class UpdateUserDto {
  const UpdateUserDto({
    this.name,
    this.avatarUrl,
    this.timezone,
  });
  
  factory UpdateUserDto.fromJson(Map<String, Object?> json) => _$UpdateUserDtoFromJson(json);
  
  /// User display name
  final String? name;

  /// Avatar URL
  @JsonKey(name: 'avatar_url')
  final String? avatarUrl;

  /// User timezone (e.g. Asia/Kolkata)
  final String? timezone;

  Map<String, Object?> toJson() => _$UpdateUserDtoToJson(this);
}
