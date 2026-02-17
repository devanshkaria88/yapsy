import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../domain/entities/voice_session.dart';
import '../bloc/voice_session_bloc.dart';
import '../widgets/voice_orb_animated.dart';

/// Pre check-in page — shown in Voice tab.
class PreCheckinPage extends StatelessWidget {
  const PreCheckinPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<VoiceSessionBloc, VoiceState>(
      listener: (context, state) {
        if (state is VoiceReady) {
          context.go(RoutePaths.voiceSession);
        }
        if (state is VoiceError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.message)),
          );
        }
      },
      builder: (context, state) {
        final isPreparing = state is VoicePreparing;

        return Scaffold(
          backgroundColor: AppColors.background,
          body: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Spacer(flex: 2),

                  // Orb
                  VoiceOrbAnimated(
                    orbState: isPreparing ? OrbState.connecting : OrbState.idle,
                    size: 160,
                  ),

                  const SizedBox(height: AppSpacing.xl),

                  Text('Ready to Yap?', style: AppTypography.h1, textAlign: TextAlign.center),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Tell Yapsy about your day.\nWe\'ll track your tasks and mood.',
                    style: AppTypography.body.copyWith(color: AppColors.textSecondary),
                    textAlign: TextAlign.center,
                  ),

                  const Spacer(flex: 2),

                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: isPreparing
                          ? null
                          : () => context.read<VoiceSessionBloc>().add(const VoicePrepareSession()),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppSpacing.buttonRadius),
                        ),
                      ),
                      child: isPreparing
                          ? const SizedBox(
                              width: 24, height: 24,
                              child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                            )
                          : Text(
                              'Start Yapsy',
                              style: TextStyle(
                                fontFamily: GoogleFonts.plusJakartaSans().fontFamily,
                                fontSize: 18, fontWeight: FontWeight.w600, color: Colors.white,
                              ),
                            ),
                    ),
                  ),

                  const SizedBox(height: AppSpacing.xl),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
