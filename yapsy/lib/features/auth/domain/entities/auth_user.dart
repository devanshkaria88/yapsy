import 'package:equatable/equatable.dart';

/// Domain entity for an authenticated user.
class AuthUser extends Equatable {
  final String id;
  final String email;
  final String name;
  final String? avatarUrl;
  final String? timezone;
  final String subscriptionTier; // 'free' | 'pro'
  final DateTime createdAt;

  const AuthUser({
    required this.id,
    required this.email,
    required this.name,
    this.avatarUrl,
    this.timezone,
    this.subscriptionTier = 'free',
    required this.createdAt,
  });

  bool get isPro => subscriptionTier == 'pro';

  @override
  List<Object?> get props => [id, email, name, avatarUrl, timezone, subscriptionTier, createdAt];
}
