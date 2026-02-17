import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../domain/entities/voice_session.dart';
import '../bloc/voice_session_bloc.dart';
import '../widgets/transcript_panel.dart';
import '../widgets/voice_orb_animated.dart';

/// Full-screen voice session page — no bottom nav.
class VoiceSessionPage extends StatelessWidget {
  const VoiceSessionPage({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<VoiceSessionBloc, VoiceState>(
      builder: (context, state) {
        final orbState = state is VoiceActive ? state.orbState : OrbState.idle;
        final transcript = state is VoiceActive ? state.transcript : <TranscriptEntry>[];

        return Scaffold(
          backgroundColor: const Color(0xFF1C1917),
          body: SafeArea(
            child: Column(
              children: [
                // Top bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: AppSpacing.sm),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        onPressed: () => Navigator.of(context).pop(),
                        icon: const Icon(Icons.close, color: Colors.white),
                      ),
                      Text(
                        _statusLabel(orbState),
                        style: AppTypography.label.copyWith(color: Colors.white70),
                      ),
                      const SizedBox(width: 48),
                    ],
                  ),
                ),

                // Orb
                Expanded(
                  flex: 4,
                  child: Center(
                    child: VoiceOrbAnimated(
                      orbState: orbState,
                      size: MediaQuery.of(context).size.width * 0.55,
                    ),
                  ),
                ),

                // Transcript
                Expanded(
                  flex: 3,
                  child: TranscriptPanel(entries: transcript),
                ),

                // End session button
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.lg),
                  child: SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () {
                        context.read<VoiceSessionBloc>().add(const VoiceEndSession());
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.danger.withValues(alpha: 0.2),
                        foregroundColor: AppColors.danger,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(AppSpacing.buttonRadius),
                        ),
                      ),
                      child: const Text('End Session'),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  String _statusLabel(OrbState state) => switch (state) {
    OrbState.connecting => 'Connecting...',
    OrbState.listening => 'Listening',
    OrbState.speaking => 'Yapsy is speaking',
    OrbState.processing => 'Thinking...',
    OrbState.error => 'Error',
    _ => 'Session active',
  };
}
