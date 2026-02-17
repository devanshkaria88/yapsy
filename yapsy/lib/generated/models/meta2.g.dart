// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'meta2.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Meta2 _$Meta2FromJson(Map<String, dynamic> json) => Meta2(
  page: json['page'] as num?,
  limit: json['limit'] as num?,
  total: json['total'] as num?,
  hasMore: json['hasMore'] as bool?,
);

Map<String, dynamic> _$Meta2ToJson(Meta2 instance) => <String, dynamic>{
  'page': instance.page,
  'limit': instance.limit,
  'total': instance.total,
  'hasMore': instance.hasMore,
};
