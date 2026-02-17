// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:json_annotation/json_annotation.dart';

part 'firebase_auth_dto.g.dart';

@JsonSerializable()
class FirebaseAuthDto {
  const FirebaseAuthDto({
    required this.idToken,
  });
  
  factory FirebaseAuthDto.fromJson(Map<String, Object?> json) => _$FirebaseAuthDtoFromJson(json);
  
  /// Firebase ID token from the client SDK
  @JsonKey(name: 'id_token')
  final String idToken;

  Map<String, Object?> toJson() => _$FirebaseAuthDtoToJson(this);
}
