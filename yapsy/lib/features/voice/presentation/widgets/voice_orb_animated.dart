import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../domain/entities/voice_session.dart';

/// Animated voice orb widget — the app's signature UI element.
///
/// Uses CustomPainter with AnimationController for smooth state transitions.
class VoiceOrbAnimated extends StatefulWidget {
  final OrbState orbState;
  final double size;

  const VoiceOrbAnimated({
    super.key,
    this.orbState = OrbState.idle,
    this.size = 200,
  });

  @override
  State<VoiceOrbAnimated> createState() => _VoiceOrbAnimatedState();
}

class _VoiceOrbAnimatedState extends State<VoiceOrbAnimated> with TickerProviderStateMixin {
  late AnimationController _breatheController;
  late AnimationController _pulseController;
  late AnimationController _rotateController;

  @override
  void initState() {
    super.initState();
    _breatheController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 3000),
    )..repeat(reverse: true);

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat(reverse: true);

    _rotateController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat();
  }

  @override
  void dispose() {
    _breatheController.dispose();
    _pulseController.dispose();
    _rotateController.dispose();
    super.dispose();
  }

  Color get _primaryColor => switch (widget.orbState) {
    OrbState.idle => AppColors.primaryLight,
    OrbState.connecting => AppColors.orbConnecting,
    OrbState.listening => AppColors.primary,
    OrbState.processing => AppColors.primary,
    OrbState.speaking => AppColors.secondary,
    OrbState.error => AppColors.danger,
    OrbState.celebration => AppColors.success,
  };

  Color get _glowColor => _primaryColor.withValues(alpha: 0.3);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: AnimatedBuilder(
        animation: Listenable.merge([_breatheController, _pulseController, _rotateController]),
        builder: (context, child) {
          return CustomPaint(
            painter: _OrbPainter(
              orbState: widget.orbState,
              breatheValue: _breatheController.value,
              pulseValue: _pulseController.value,
              rotateValue: _rotateController.value,
              primaryColor: _primaryColor,
              glowColor: _glowColor,
            ),
          );
        },
      ),
    );
  }
}

class _OrbPainter extends CustomPainter {
  final OrbState orbState;
  final double breatheValue;
  final double pulseValue;
  final double rotateValue;
  final Color primaryColor;
  final Color glowColor;

  _OrbPainter({
    required this.orbState,
    required this.breatheValue,
    required this.pulseValue,
    required this.rotateValue,
    required this.primaryColor,
    required this.glowColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final baseRadius = size.width * 0.35;

    // Outer glow rings
    _drawGlowRings(canvas, center, baseRadius);

    // Main orb
    _drawMainOrb(canvas, center, baseRadius);

    // State-specific effects
    switch (orbState) {
      case OrbState.listening:
        _drawListeningPulses(canvas, center, baseRadius);
        break;
      case OrbState.speaking:
        _drawSpeakingWaves(canvas, center, baseRadius);
        break;
      case OrbState.processing:
        _drawProcessingDots(canvas, center, baseRadius);
        break;
      default:
        break;
    }
  }

  void _drawGlowRings(Canvas canvas, Offset center, double baseRadius) {
    for (int i = 3; i > 0; i--) {
      final expansion = orbState == OrbState.listening
          ? pulseValue * 20 * i
          : breatheValue * 8 * i;
      final paint = Paint()
        ..color = glowColor.withValues(alpha: 0.1 / i)
        ..style = PaintingStyle.fill;
      canvas.drawCircle(center, baseRadius + expansion, paint);
    }
  }

  void _drawMainOrb(Canvas canvas, Offset center, double baseRadius) {
    final breatheOffset = breatheValue * 6;
    final radius = baseRadius + breatheOffset;

    // Gradient fill
    final paint = Paint()
      ..shader = RadialGradient(
        colors: [
          primaryColor,
          primaryColor.withValues(alpha: 0.7),
        ],
      ).createShader(Rect.fromCircle(center: center, radius: radius));

    canvas.drawCircle(center, radius, paint);

    // Inner highlight
    final highlightPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.15)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(
      center.translate(-radius * 0.2, -radius * 0.2),
      radius * 0.4,
      highlightPaint,
    );
  }

  void _drawListeningPulses(Canvas canvas, Offset center, double baseRadius) {
    for (int i = 0; i < 3; i++) {
      final delay = i * 0.3;
      final progress = ((pulseValue + delay) % 1.0);
      final radius = baseRadius + progress * 40;
      final opacity = (1.0 - progress) * 0.3;
      final paint = Paint()
        ..color = primaryColor.withValues(alpha: opacity)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2;
      canvas.drawCircle(center, radius, paint);
    }
  }

  void _drawSpeakingWaves(Canvas canvas, Offset center, double baseRadius) {
    final paint = Paint()
      ..color = primaryColor.withValues(alpha: 0.2)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;

    final path = Path();
    for (double angle = 0; angle < math.pi * 2; angle += 0.1) {
      final wave = math.sin(angle * 6 + rotateValue * math.pi * 2) * 8 * pulseValue;
      final r = baseRadius + 10 + wave;
      final x = center.dx + r * math.cos(angle);
      final y = center.dy + r * math.sin(angle);
      if (angle == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }
    path.close();
    canvas.drawPath(path, paint);
  }

  void _drawProcessingDots(Canvas canvas, Offset center, double baseRadius) {
    for (int i = 0; i < 3; i++) {
      final angle = rotateValue * math.pi * 2 + (i * math.pi * 2 / 3);
      final dotCenter = Offset(
        center.dx + (baseRadius + 20) * math.cos(angle),
        center.dy + (baseRadius + 20) * math.sin(angle),
      );
      final paint = Paint()..color = primaryColor.withValues(alpha: 0.6);
      canvas.drawCircle(dotCenter, 5, paint);
    }
  }

  @override
  bool shouldRepaint(covariant _OrbPainter oldDelegate) => true;
}

/// Helper widget that rebuilds on multiple [Listenable] changes.
class AnimatedBuilder extends StatelessWidget {
  final Listenable animation;
  final Widget Function(BuildContext, Widget?) builder;

  const AnimatedBuilder({super.key, required this.animation, required this.builder});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder2(animation: animation, builder: builder);
  }
}

class AnimatedBuilder2 extends AnimatedWidget {
  final Widget Function(BuildContext, Widget?) builder;

  const AnimatedBuilder2({super.key, required Listenable animation, required this.builder})
      : super(listenable: animation);

  @override
  Widget build(BuildContext context) => builder(context, null);
}
