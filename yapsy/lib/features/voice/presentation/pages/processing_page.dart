import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../bloc/voice_session_bloc.dart';
import '../widgets/processing_steps.dart';

/// Post-voice processing page — shows step-by-step progress.
class ProcessingPage extends StatelessWidget {
  const ProcessingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<VoiceSessionBloc, VoiceState>(
      listener: (context, state) {
        if (state is VoiceCompleted) {
          context.go('${RoutePaths.journal}/${state.journalId}');
        }
        if (state is VoiceError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message)),
          );
          context.go(RoutePaths.home);
        }
      },
      builder: (context, state) {
        final step = state is VoiceProcessingState ? state.step : 0;

        return Scaffold(
          backgroundColor: AppColors.background,
          body: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(AppSpacing.xl),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Spacer(flex: 2),
                  Container(
                    width: 80, height: 80,
                    decoration: BoxDecoration(
                      color: AppColors.primarySurface,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.auto_awesome, size: 36, color: AppColors.primary),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  Text('Processing your check-in', style: AppTypography.h2),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Yapsy is analyzing your conversation...',
                    style: AppTypography.bodySmall,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  ProcessingSteps(currentStep: step),
                  const Spacer(flex: 3),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
