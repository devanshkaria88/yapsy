// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

import 'onboarding_dto_gender.dart';

part 'onboarding_dto.g.dart';

@JsonSerializable()
class OnboardingDto {
  const OnboardingDto({
    required this.name,
    required this.dateOfBirth,
    required this.gender,
    this.timezone,
  });
  
  factory OnboardingDto.fromJson(Map<String, Object?> json) => _$OnboardingDtoFromJson(json);
  
  /// User display name
  final String name;

  /// Date of birth (YYYY-MM-DD)
  @JsonKey(name: 'date_of_birth')
  final String dateOfBirth;

  /// Gender
  final OnboardingDtoGender gender;

  /// User timezone
  final String? timezone;

  Map<String, Object?> toJson() => _$OnboardingDtoToJson(this);
}
