// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

@JsonEnum()
enum Days {
  @JsonValue(7)
  value7(7),
  @JsonValue(14)
  value14(14),
  @JsonValue(30)
  value30(30),
  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const Days(this.json);

  factory Days.fromJson(num json) => values.firstWhere(
        (e) => e.json == json,
        orElse: () => $unknown,
      );

  final num? json;

  num? toJson() => json;

  @override
  String toString() => json?.toString() ?? super.toString();
  /// Returns all defined enum values excluding the $unknown value.
  static List<Days> get $valuesDefined => values.where((value) => value != $unknown).toList();
}
