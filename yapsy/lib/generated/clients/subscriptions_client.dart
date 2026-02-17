// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint, unused_import, invalid_annotation_target, unnecessary_import

import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';

import '../models/cancel_subscription_response_dto.dart';
import '../models/create_subscription_dto.dart';
import '../models/create_subscription_response_dto.dart';
import '../models/subscription_plan_response_dto.dart';
import '../models/subscription_status_response_dto.dart';
import '../models/verify_payment_dto.dart';
import '../models/verify_payment_response_dto.dart';

part 'subscriptions_client.g.dart';

@RestApi()
abstract class SubscriptionsClient {
  factory SubscriptionsClient(Dio dio, {String? baseUrl}) = _SubscriptionsClient;

  /// Get all active subscription plans
  @GET('/api/v1/mobile/subscriptions/plans')
  Future<List<SubscriptionPlanResponseDto>> mobileSubscriptionsControllerGetPlans();

  /// Get current user subscription status
  @GET('/api/v1/mobile/subscriptions/status')
  Future<SubscriptionStatusResponseDto> mobileSubscriptionsControllerGetStatus();

  /// Create a new subscription
  @POST('/api/v1/mobile/subscriptions/create')
  Future<CreateSubscriptionResponseDto> mobileSubscriptionsControllerCreateSubscription({
    @Body() required CreateSubscriptionDto body,
  });

  /// Verify payment after subscription
  @POST('/api/v1/mobile/subscriptions/verify')
  Future<VerifyPaymentResponseDto> mobileSubscriptionsControllerVerifyPayment({
    @Body() required VerifyPaymentDto body,
  });

  /// Cancel current subscription
  @POST('/api/v1/mobile/subscriptions/cancel')
  Future<CancelSubscriptionResponseDto> mobileSubscriptionsControllerCancelSubscription();
}
