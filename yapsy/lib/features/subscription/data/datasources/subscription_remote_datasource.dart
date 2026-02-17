import 'package:dio/dio.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/error/exceptions.dart';
import '../../../../generated/models/create_subscription_dto.dart';
import '../../../../generated/models/redeem_promo_dto.dart';
import '../../../../generated/models/verify_payment_dto.dart';

class SubscriptionRemoteDataSource {
  final Dio _dio;
  SubscriptionRemoteDataSource({required Dio dio}) : _dio = dio;

  Future<List<Map<String, dynamic>>> getPlans() async {
    try {
      final r = await _dio.get(ApiEndpoints.subscriptionPlans);
      final data = (r.data as Map<String, dynamic>)['data'];
      return data is List ? data.cast<Map<String, dynamic>>() : [];
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> getStatus() async {
    try {
      final r = await _dio.get(ApiEndpoints.subscriptionStatus);
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>? ?? {};
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> createSubscription(String planId, {String? promoCode}) async {
    try {
      final dto = CreateSubscriptionDto(planId: planId, promoCode: promoCode);
      final r = await _dio.post(ApiEndpoints.subscriptionCreate, data: dto.toJson());
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>;
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> verifyPayment({
    required String razorpayPaymentId,
    required String razorpaySubscriptionId,
    required String razorpaySignature,
  }) async {
    try {
      final dto = VerifyPaymentDto(
        razorpayPaymentId: razorpayPaymentId,
        razorpaySubscriptionId: razorpaySubscriptionId,
        razorpaySignature: razorpaySignature,
      );
      final r = await _dio.post(ApiEndpoints.subscriptionVerify, data: dto.toJson());
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>? ?? {};
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<void> cancelSubscription() async {
    try {
      await _dio.post(ApiEndpoints.subscriptionCancel);
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> validatePromo(String code) async {
    try {
      final r = await _dio.get(ApiEndpoints.promoValidate(code));
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>? ?? {};
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  Future<Map<String, dynamic>> redeemPromo(String code) async {
    try {
      final dto = RedeemPromoDto(code: code);
      final r = await _dio.post(ApiEndpoints.promoRedeem, data: dto.toJson());
      return (r.data as Map<String, dynamic>)['data'] as Map<String, dynamic>? ?? {};
    } on DioException catch (e) {
      throw ServerException(message: _msg(e), statusCode: e.response?.statusCode);
    }
  }

  String _msg(DioException e) =>
      (e.response?.data as Map<String, dynamic>?)?['message'] as String? ?? 'Request failed';
}
