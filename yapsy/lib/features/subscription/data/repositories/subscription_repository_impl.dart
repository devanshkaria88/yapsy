import 'package:dartz/dartz.dart';
import '../../../../core/error/error_handler.dart';
import '../../../../core/error/failures.dart';
import '../../domain/entities/subscription_plan.dart';
import '../../domain/repositories/subscription_repository.dart';
import '../datasources/subscription_remote_datasource.dart';

class SubscriptionRepositoryImpl implements SubscriptionRepository {
  final SubscriptionRemoteDataSource _remote;
  SubscriptionRepositoryImpl({required SubscriptionRemoteDataSource remote}) : _remote = remote;

  @override
  Future<Either<Failure, List<SubscriptionPlan>>> getPlans() async {
    try {
      final data = await _remote.getPlans();
      return Right(data.map((j) => SubscriptionPlan(
        id: j['id'] as String,
        name: j['name'] as String? ?? '',
        description: j['description'] as String? ?? '',
        price: (j['price'] as num).toDouble(),
        currency: j['currency'] as String? ?? 'INR',
        interval: j['interval'] as String? ?? 'monthly',
        features: (j['features'] as List?)?.cast<String>() ?? [],
      )).toList());
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, SubscriptionStatus>> getStatus() async {
    try {
      final data = await _remote.getStatus();
      return Right(SubscriptionStatus(
        tier: data['tier'] as String? ?? 'free',
        planId: data['plan_id'] as String?,
        expiresAt: data['expires_at'] != null ? DateTime.tryParse(data['expires_at'] as String) : null,
        isActive: data['is_active'] as bool? ?? false,
        razorpaySubscriptionId: data['razorpay_subscription_id'] as String?,
      ));
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> createSubscription(String planId) async {
    try {
      final data = await _remote.createSubscription(planId);
      return Right(data);
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, bool>> verifyPayment({
    required String razorpayPaymentId,
    required String razorpaySubscriptionId,
    required String razorpaySignature,
  }) async {
    try {
      await _remote.verifyPayment(
        razorpayPaymentId: razorpayPaymentId,
        razorpaySubscriptionId: razorpaySubscriptionId,
        razorpaySignature: razorpaySignature,
      );
      return const Right(true);
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, void>> cancelSubscription() async {
    try {
      await _remote.cancelSubscription();
      return const Right(null);
    } catch (e) {
      return Left(ErrorHandler.mapExceptionToFailure(e));
    }
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> validatePromo(String code) async {
    try { return Right(await _remote.validatePromo(code)); } catch (e) { return Left(ErrorHandler.mapExceptionToFailure(e)); }
  }

  @override
  Future<Either<Failure, Map<String, dynamic>>> redeemPromo(String code) async {
    try { return Right(await _remote.redeemPromo(code)); } catch (e) { return Left(ErrorHandler.mapExceptionToFailure(e)); }
  }
}
