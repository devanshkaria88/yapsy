import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../domain/entities/mood_data.dart';

/// Mood trend line chart using fl_chart.
class MoodChart extends StatelessWidget {
  final List<MoodChartData> data;
  final String period;
  final ValueChanged<String>? onPeriodChanged;

  const MoodChart({super.key, required this.data, this.period = '7d', this.onPeriodChanged});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(child: Text('Mood Trend', style: AppTypography.h3)),
              // Period toggle
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: '7d', label: Text('7D')),
                  ButtonSegment(value: '14d', label: Text('14D')),
                  ButtonSegment(value: '30d', label: Text('30D')),
                ],
                selected: {period},
                onSelectionChanged: (s) => onPeriodChanged?.call(s.first),
                style: const ButtonStyle(visualDensity: VisualDensity.compact),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          SizedBox(
            height: 200,
            child: data.isEmpty
                ? Center(child: Text('No mood data yet', style: AppTypography.bodySmall))
                : LineChart(_buildChart()),
          ),
        ],
      ),
    );
  }

  LineChartData _buildChart() {
    final spots = data.asMap().entries.map((e) =>
      FlSpot(e.key.toDouble(), e.value.score),
    ).toList();

    return LineChartData(
      minY: 0, maxY: 10,
      gridData: FlGridData(
        show: true,
        drawVerticalLine: false,
        horizontalInterval: 2,
        getDrawingHorizontalLine: (value) => FlLine(
          color: AppColors.divider,
          strokeWidth: 1,
        ),
      ),
      titlesData: FlTitlesData(
        leftTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            interval: 2,
            reservedSize: 28,
            getTitlesWidget: (value, meta) => Text(
              value.toInt().toString(),
              style: AppTypography.caption.copyWith(fontSize: 11),
            ),
          ),
        ),
        bottomTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      ),
      borderData: FlBorderData(show: false),
      lineBarsData: [
        LineChartBarData(
          spots: spots,
          isCurved: true,
          curveSmoothness: 0.3,
          color: AppColors.primary,
          barWidth: 3,
          isStrokeCapRound: true,
          dotData: FlDotData(
            show: true,
            getDotPainter: (spot, percent, bar, index) => FlDotCirclePainter(
              radius: 4,
              color: AppColors.moodColor(spot.y.round()),
              strokeWidth: 2,
              strokeColor: AppColors.surface,
            ),
          ),
          belowBarData: BarAreaData(
            show: true,
            color: AppColors.primary.withValues(alpha: 0.1),
          ),
        ),
      ],
      lineTouchData: LineTouchData(
        touchTooltipData: LineTouchTooltipData(
          getTooltipItems: (touchedSpots) => touchedSpots.map((spot) =>
            LineTooltipItem(
              '${spot.y.toStringAsFixed(1)}/10',
              AppTypography.caption.copyWith(color: Colors.white),
            ),
          ).toList(),
        ),
      ),
    );
  }
}
