import 'package:dartz/dartz.dart';
import '../../../../core/error/failures.dart';
import '../entities/subscription_plan.dart';

abstract class SubscriptionRepository {
  Future<Either<Failure, List<SubscriptionPlan>>> getPlans();
  Future<Either<Failure, SubscriptionStatus>> getStatus();
  Future<Either<Failure, Map<String, dynamic>>> createSubscription(String planId);
  Future<Either<Failure, bool>> verifyPayment({
    required String razorpayPaymentId,
    required String razorpaySubscriptionId,
    required String razorpaySignature,
  });
  Future<Either<Failure, void>> cancelSubscription();
  Future<Either<Failure, Map<String, dynamic>>> validatePromo(String code);
  Future<Either<Failure, Map<String, dynamic>>> redeemPromo(String code);
}
