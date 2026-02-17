/// Generic API response envelope.
///
/// All backend responses follow:
/// ```json
/// { "success": true, "data": { ... }, "meta": { ... } }
/// ```
class ApiResponse<T> {
  final bool success;
  final T data;
  final PaginationMeta? meta;

  const ApiResponse({
    required this.success,
    required this.data,
    this.meta,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic json) fromJsonT,
  ) {
    return ApiResponse(
      success: json['success'] as bool? ?? true,
      data: fromJsonT(json['data']),
      meta: json['meta'] != null
          ? PaginationMeta.fromJson(json['meta'] as Map<String, dynamic>)
          : null,
    );
  }
}

/// Pagination metadata from the API.
class PaginationMeta {
  final int page;
  final int limit;
  final int total;
  final bool hasMore;

  const PaginationMeta({
    required this.page,
    required this.limit,
    required this.total,
    required this.hasMore,
  });

  factory PaginationMeta.fromJson(Map<String, dynamic> json) {
    return PaginationMeta(
      page: json['page'] as int? ?? 1,
      limit: json['limit'] as int? ?? 20,
      total: json['total'] as int? ?? 0,
      hasMore: json['hasMore'] as bool? ?? false,
    );
  }
}
