import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/date_utils.dart';
import '../../../../core/widgets/mood_badge.dart';
import '../../../../core/widgets/yapsy_card.dart';
import '../../../../core/widgets/yapsy_error_state.dart';
import '../../domain/entities/journal_entry.dart';
import '../bloc/journal_detail_cubit.dart';

class JournalDetailPage extends StatefulWidget {
  final String id;
  const JournalDetailPage({super.key, required this.id});

  @override
  State<JournalDetailPage> createState() => _JournalDetailPageState();
}

class _JournalDetailPageState extends State<JournalDetailPage> {
  @override
  void initState() {
    super.initState();
    context.read<JournalDetailCubit>().load(widget.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Journal Entry')),
      body: BlocBuilder<JournalDetailCubit, JournalDetailState>(
        builder: (context, state) {
          if (state is JournalDetailLoading) return const Center(child: CircularProgressIndicator());
          if (state is JournalDetailError) return YapsyErrorState(message: state.message, onRetry: () => context.read<JournalDetailCubit>().load(widget.id));
          if (state is JournalDetailLoaded) return _buildContent(state.journal);
          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildContent(JournalEntry j) {
    return ListView(
      padding: const EdgeInsets.all(AppSpacing.md),
      children: [
        // Mood section
        YapsyCard(
          child: Row(
            children: [
              MoodBadge(score: j.moodScore, size: 48),
              const SizedBox(width: AppSpacing.md),
              Expanded(child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(j.moodLabel ?? 'Mood', style: AppTypography.h3),
                  Text(AppDateUtils.dayMonthYear(j.createdAt), style: AppTypography.caption),
                ],
              )),
            ],
          ),
        ),

        const SizedBox(height: AppSpacing.md),

        // Summary
        YapsyCard(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Summary', style: AppTypography.h3),
              const SizedBox(height: AppSpacing.sm),
              Text(j.summary, style: AppTypography.body),
            ],
          ),
        ),

        // Wins
        if (j.wins.isNotEmpty) ...[
          const SizedBox(height: AppSpacing.md),
          _BulletSection(title: 'Wins \u{1F389}', items: j.wins, color: AppColors.success),
        ],

        // Struggles
        if (j.struggles.isNotEmpty) ...[
          const SizedBox(height: AppSpacing.md),
          _BulletSection(title: 'Struggles', items: j.struggles, color: AppColors.secondary),
        ],

        // Actions taken
        if (j.actionsTaken.isNotEmpty) ...[
          const SizedBox(height: AppSpacing.md),
          _BulletSection(title: 'Actions Taken', items: j.actionsTaken, color: AppColors.primary),
        ],

        // Themes
        if (j.themes.isNotEmpty) ...[
          const SizedBox(height: AppSpacing.md),
          YapsyCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Themes', style: AppTypography.h3),
                const SizedBox(height: AppSpacing.sm),
                Wrap(
                  spacing: AppSpacing.sm, runSpacing: AppSpacing.sm,
                  children: j.themes.map((t) => Chip(
                    label: Text(t, style: AppTypography.caption.copyWith(color: AppColors.primary)),
                    backgroundColor: AppColors.primarySurface,
                    side: BorderSide.none,
                  )).toList(),
                ),
              ],
            ),
          ),
        ],

        // Transcript
        if (j.transcript != null) ...[
          const SizedBox(height: AppSpacing.md),
          _ExpandableTranscript(transcript: j.transcript!),
        ],

        const SizedBox(height: AppSpacing.xxl),
      ],
    );
  }
}

class _BulletSection extends StatelessWidget {
  final String title;
  final List<String> items;
  final Color color;
  const _BulletSection({required this.title, required this.items, required this.color});

  @override
  Widget build(BuildContext context) {
    return YapsyCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: AppTypography.h3),
          const SizedBox(height: AppSpacing.sm),
          ...items.map((item) => Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(width: 6, height: 6, margin: const EdgeInsets.only(top: 7, right: 10),
                  decoration: BoxDecoration(shape: BoxShape.circle, color: color)),
                Expanded(child: Text(item, style: AppTypography.body)),
              ],
            ),
          )),
        ],
      ),
    );
  }
}

class _ExpandableTranscript extends StatefulWidget {
  final String transcript;
  const _ExpandableTranscript({required this.transcript});

  @override
  State<_ExpandableTranscript> createState() => _ExpandableTranscriptState();
}

class _ExpandableTranscriptState extends State<_ExpandableTranscript> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return YapsyCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          GestureDetector(
            onTap: () => setState(() => _expanded = !_expanded),
            child: Row(
              children: [
                Expanded(child: Text('Transcript', style: AppTypography.h3)),
                Icon(_expanded ? Icons.expand_less : Icons.expand_more, color: AppColors.textSecondary),
              ],
            ),
          ),
          if (_expanded) ...[
            const SizedBox(height: AppSpacing.sm),
            Text(widget.transcript, style: AppTypography.bodySmall),
          ],
        ],
      ),
    );
  }
}
