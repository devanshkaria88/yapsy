import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/yapsy_error_state.dart';
import '../../domain/entities/subscription_plan.dart';
import '../bloc/subscription_cubit.dart';

class SubscriptionPage extends StatefulWidget {
  const SubscriptionPage({super.key});
  @override
  State<SubscriptionPage> createState() => _SubscriptionPageState();
}

class _SubscriptionPageState extends State<SubscriptionPage> {
  @override
  void initState() {
    super.initState();
    context.read<SubscriptionCubit>().load();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Subscription')),
      body: BlocConsumer<SubscriptionCubit, SubscriptionState>(
        listener: (context, state) {
          if (state is SubscriptionSuccess) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.message)));
          }
          if (state is SubscriptionError) {
            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.message)));
          }
        },
        builder: (context, state) {
          if (state is SubscriptionLoading) return const Center(child: CircularProgressIndicator());
          if (state is SubscriptionError) return YapsyErrorState(message: state.message, onRetry: () => context.read<SubscriptionCubit>().load());
          if (state is SubscriptionLoaded) return _buildContent(context, state);
          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildContent(BuildContext context, SubscriptionLoaded state) {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.md),
      children: [
        // Current status
        Container(
          padding: const EdgeInsets.all(AppSpacing.lg),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: state.status.isPro
                  ? [AppColors.secondary, AppColors.secondaryDark]
                  : [AppColors.primary, AppColors.primaryDark],
            ),
            borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
          ),
          child: Column(
            children: [
              Text(
                state.status.isPro ? 'Yapsy Pro' : 'Free Plan',
                style: AppTypography.h2.copyWith(color: Colors.white),
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                state.status.isPro ? 'You have full access to all features' : 'Upgrade to unlock all features',
                style: AppTypography.bodySmall.copyWith(color: Colors.white70),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
        const SizedBox(height: AppSpacing.xl),

        // Plans
        ...state.plans.map((plan) => _PlanCard(
          plan: plan,
          isCurrentPlan: state.status.planId == plan.id,
          onSubscribe: () async {
            final data = await context.read<SubscriptionCubit>().createSubscription(plan.id);
            if (data != null) {
              // Razorpay checkout would be triggered here
            }
          },
        )),

        // Cancel button for Pro users
        if (state.status.isPro) ...[
          const SizedBox(height: AppSpacing.xl),
          TextButton(
            onPressed: () => _showCancelDialog(context),
            child: Text('Cancel Subscription', style: AppTypography.label.copyWith(color: AppColors.danger)),
          ),
        ],
      ],
    );
  }

  void _showCancelDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Cancel Subscription?'),
        content: const Text('You\'ll lose access to Pro features at the end of your billing cycle.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Keep')),
          TextButton(
            onPressed: () {
              context.read<SubscriptionCubit>().cancel();
              Navigator.pop(context);
            },
            child: Text('Cancel', style: TextStyle(color: AppColors.danger)),
          ),
        ],
      ),
    );
  }
}

class _PlanCard extends StatelessWidget {
  final SubscriptionPlan plan;
  final bool isCurrentPlan;
  final VoidCallback? onSubscribe;

  const _PlanCard({required this.plan, required this.isCurrentPlan, this.onSubscribe});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
        border: Border.all(color: isCurrentPlan ? AppColors.primary : AppColors.border, width: isCurrentPlan ? 2 : 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text(plan.name, style: AppTypography.h3)),
              if (isCurrentPlan)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(10)),
                  child: Text('Current', style: AppTypography.overline.copyWith(color: Colors.white, fontSize: 10)),
                ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '\u{20B9}${plan.price.toStringAsFixed(0)}/${plan.interval}',
            style: AppTypography.h2.copyWith(color: AppColors.primary),
          ),
          const SizedBox(height: AppSpacing.sm),
          ...plan.features.map((f) => Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: Row(children: [
              const Icon(Icons.check_circle, size: 16, color: AppColors.success),
              const SizedBox(width: 8),
              Expanded(child: Text(f, style: AppTypography.bodySmall)),
            ]),
          )),
          if (!isCurrentPlan) ...[
            const SizedBox(height: AppSpacing.md),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(onPressed: onSubscribe, child: const Text('Subscribe')),
            ),
          ],
        ],
      ),
    );
  }
}
