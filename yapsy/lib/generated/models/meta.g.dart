// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'meta.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Meta _$MetaFromJson(Map<String, dynamic> json) => Meta(
  page: json['page'] as num?,
  limit: json['limit'] as num?,
  total: json['total'] as num?,
  hasMore: json['hasMore'] as bool?,
);

Map<String, dynamic> _$MetaToJson(Meta instance) => <String, dynamic>{
  'page': instance.page,
  'limit': instance.limit,
  'total': instance.total,
  'hasMore': instance.hasMore,
};
