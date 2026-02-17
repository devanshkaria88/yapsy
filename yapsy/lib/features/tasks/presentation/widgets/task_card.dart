import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/date_utils.dart';
import '../../domain/entities/task.dart';

/// Single task card with completion toggle and swipe actions.
class TaskCard extends StatelessWidget {
  final Task task;
  final VoidCallback? onComplete;
  final VoidCallback? onTap;
  final VoidCallback? onDelete;
  final VoidCallback? onRollover;

  const TaskCard({
    super.key,
    required this.task,
    this.onComplete,
    this.onTap,
    this.onDelete,
    this.onRollover,
  });

  @override
  Widget build(BuildContext context) {
    return Dismissible(
      key: Key(task.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: AppSpacing.lg),
        decoration: BoxDecoration(
          color: AppColors.danger.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
        ),
        child: const Icon(Icons.delete_outline, color: AppColors.danger),
      ),
      onDismissed: (_) => onDelete?.call(),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.md),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(AppSpacing.cardRadius),
            border: Border.all(
              color: task.isOverdue ? AppColors.danger.withValues(alpha: 0.3) : AppColors.border,
            ),
          ),
          child: Row(
            children: [
              // Completion toggle
              GestureDetector(
                onTap: onComplete,
                child: Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: task.isCompleted ? AppColors.success : Colors.transparent,
                    border: Border.all(
                      color: task.isCompleted ? AppColors.success : AppColors.border,
                      width: 2,
                    ),
                  ),
                  child: task.isCompleted
                      ? const Icon(Icons.check, size: 14, color: Colors.white)
                      : null,
                ),
              ),
              const SizedBox(width: AppSpacing.md),

              // Task content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      task.title,
                      style: AppTypography.bodyLarge.copyWith(
                        decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                        color: task.isCompleted ? AppColors.textTertiary : AppColors.textPrimary,
                      ),
                    ),
                    if (task.dueDate != null) ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(
                            Icons.schedule,
                            size: 14,
                            color: task.isOverdue ? AppColors.danger : AppColors.textTertiary,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            AppDateUtils.relativeDay(task.dueDate!),
                            style: AppTypography.caption.copyWith(
                              color: task.isOverdue ? AppColors.danger : AppColors.textTertiary,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),

              // Priority indicator
              _PriorityDot(priority: task.priority),

              // Rollover button for overdue
              if (task.isOverdue && onRollover != null) ...[
                const SizedBox(width: AppSpacing.sm),
                GestureDetector(
                  onTap: onRollover,
                  child: Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: AppColors.secondary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: const Icon(Icons.redo, size: 16, color: AppColors.secondary),
                  ),
                ),
              ],

              // Voice indicator
              if (task.source == TaskSource.voice) ...[
                const SizedBox(width: AppSpacing.sm),
                const Icon(Icons.mic, size: 16, color: AppColors.primaryLight),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _PriorityDot extends StatelessWidget {
  final TaskPriority priority;
  const _PriorityDot({required this.priority});

  @override
  Widget build(BuildContext context) {
    final color = switch (priority) {
      TaskPriority.high => AppColors.danger,
      TaskPriority.medium => AppColors.secondary,
      TaskPriority.low => AppColors.success,
    };
    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(shape: BoxShape.circle, color: color),
    );
  }
}
