// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

@JsonEnum()
enum SubscriptionStatusResponseDtoSubscriptionStatus {
  @JsonValue('free')
  free('free'),
  @JsonValue('pro')
  pro('pro'),
  @JsonValue('cancelled')
  cancelled('cancelled'),
  @JsonValue('paused')
  paused('paused'),
  @JsonValue('past_due')
  pastDue('past_due'),
  /// Default value for all unparsed values, allows backward compatibility when adding new values on the backend.
  $unknown(null);

  const SubscriptionStatusResponseDtoSubscriptionStatus(this.json);

  factory SubscriptionStatusResponseDtoSubscriptionStatus.fromJson(String json) => values.firstWhere(
        (e) => e.json == json,
        orElse: () => $unknown,
      );

  final String? json;

  String? toJson() => json;

  @override
  String toString() => json?.toString() ?? super.toString();
  /// Returns all defined enum values excluding the $unknown value.
  static List<SubscriptionStatusResponseDtoSubscriptionStatus> get $valuesDefined => values.where((value) => value != $unknown).toList();
}
