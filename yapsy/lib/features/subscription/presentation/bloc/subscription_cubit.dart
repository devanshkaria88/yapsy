import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../domain/entities/subscription_plan.dart';
import '../../domain/repositories/subscription_repository.dart';

abstract class SubscriptionState extends Equatable {
  const SubscriptionState();
  @override
  List<Object?> get props => [];
}

class SubscriptionInitial extends SubscriptionState { const SubscriptionInitial(); }
class SubscriptionLoading extends SubscriptionState { const SubscriptionLoading(); }
class SubscriptionLoaded extends SubscriptionState {
  final List<SubscriptionPlan> plans;
  final SubscriptionStatus status;
  const SubscriptionLoaded({required this.plans, required this.status});
  @override
  List<Object?> get props => [plans, status];
}
class SubscriptionPurchasing extends SubscriptionState { const SubscriptionPurchasing(); }
class SubscriptionSuccess extends SubscriptionState {
  final String message;
  const SubscriptionSuccess(this.message);
  @override
  List<Object?> get props => [message];
}
class SubscriptionError extends SubscriptionState {
  final String message;
  const SubscriptionError(this.message);
  @override
  List<Object?> get props => [message];
}

class SubscriptionCubit extends Cubit<SubscriptionState> {
  final SubscriptionRepository _repository;

  SubscriptionCubit({required SubscriptionRepository repository})
      : _repository = repository,
        super(const SubscriptionInitial());

  Future<void> load() async {
    emit(const SubscriptionLoading());
    final results = await Future.wait([_repository.getPlans(), _repository.getStatus()]);

    final plansResult = results[0] as dynamic;
    final statusResult = results[1] as dynamic;

    if (plansResult.isLeft() || statusResult.isLeft()) {
      emit(const SubscriptionError('Failed to load subscription info'));
      return;
    }

    emit(SubscriptionLoaded(
      plans: plansResult.getOrElse(() => <SubscriptionPlan>[]),
      status: statusResult.getOrElse(() => const SubscriptionStatus(tier: 'free')),
    ));
  }

  Future<Map<String, dynamic>?> createSubscription(String planId) async {
    emit(const SubscriptionPurchasing());
    final result = await _repository.createSubscription(planId);
    return result.fold(
      (f) { emit(SubscriptionError(f.message)); return null; },
      (data) => data,
    );
  }

  Future<void> verifyPayment({
    required String razorpayPaymentId,
    required String razorpaySubscriptionId,
    required String razorpaySignature,
  }) async {
    final result = await _repository.verifyPayment(
      razorpayPaymentId: razorpayPaymentId,
      razorpaySubscriptionId: razorpaySubscriptionId,
      razorpaySignature: razorpaySignature,
    );
    result.fold(
      (f) => emit(SubscriptionError(f.message)),
      (_) {
        emit(const SubscriptionSuccess('Welcome to Yapsy Pro!'));
        load();
      },
    );
  }

  Future<void> cancel() async {
    final result = await _repository.cancelSubscription();
    result.fold(
      (f) => emit(SubscriptionError(f.message)),
      (_) {
        emit(const SubscriptionSuccess('Subscription cancelled'));
        load();
      },
    );
  }
}
