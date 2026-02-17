import 'package:equatable/equatable.dart';

class SubscriptionPlan extends Equatable {
  final String id;
  final String name;
  final String description;
  final double price;
  final String currency;
  final String interval; // 'monthly' | 'yearly'
  final List<String> features;

  const SubscriptionPlan({
    required this.id, required this.name, required this.description,
    required this.price, this.currency = 'INR', required this.interval,
    this.features = const [],
  });

  @override
  List<Object?> get props => [id, name, price, interval];
}

class SubscriptionStatus extends Equatable {
  final String tier; // 'free' | 'pro'
  final String? planId;
  final DateTime? expiresAt;
  final bool isActive;
  final String? razorpaySubscriptionId;

  const SubscriptionStatus({
    required this.tier, this.planId, this.expiresAt,
    this.isActive = false, this.razorpaySubscriptionId,
  });

  bool get isPro => tier == 'pro' && isActive;

  @override
  List<Object?> get props => [tier, planId, expiresAt, isActive];
}
