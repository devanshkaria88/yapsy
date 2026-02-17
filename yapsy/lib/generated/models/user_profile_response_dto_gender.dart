// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

@JsonEnum()
enum UserProfileResponseDtoGender {
  @JsonValue('male')
  male('male'),
  @JsonValue('female')
  female('female'),
  @JsonValue('non_binary')
  nonBinary('non_binary'),
  @JsonValue('prefer_not_to_say')
  preferNotToSay('prefer_not_to_say'),
  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const UserProfileResponseDtoGender(this.json);

  factory UserProfileResponseDtoGender.fromJson(String json) => values.firstWhere(
        (e) => e.json == json,
        orElse: () => $unknown,
      );

  final String? json;

  String? toJson() => json;

  @override
  String toString() => json?.toString() ?? super.toString();
  /// Returns all defined enum values excluding the $unknown value.
  static List<UserProfileResponseDtoGender> get $valuesDefined => values.where((value) => value != $unknown).toList();
}
