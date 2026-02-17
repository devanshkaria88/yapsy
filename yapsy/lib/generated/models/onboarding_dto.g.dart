// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'onboarding_dto.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OnboardingDto _$OnboardingDtoFromJson(Map<String, dynamic> json) =>
    OnboardingDto(
      name: json['name'] as String,
      dateOfBirth: json['date_of_birth'] as String,
      gender: OnboardingDtoGender.fromJson(json['gender'] as String),
      timezone: json['timezone'] as String?,
    );

Map<String, dynamic> _$OnboardingDtoToJson(OnboardingDto instance) =>
    <String, dynamic>{
      'name': instance.name,
      'date_of_birth': instance.dateOfBirth,
      'gender': instance.gender,
      'timezone': instance.timezone,
    };
