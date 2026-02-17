import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../domain/entities/task.dart';
import '../bloc/tasks_bloc.dart';

/// Bottom sheet for creating / editing a task.
class TaskFormSheet extends StatefulWidget {
  final Task? task; // null = create mode

  const TaskFormSheet({super.key, this.task});

  static Future<void> show(BuildContext context, {Task? task}) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      builder: (_) => BlocProvider.value(
        value: context.read<TasksBloc>(),
        child: TaskFormSheet(task: task),
      ),
    );
  }

  @override
  State<TaskFormSheet> createState() => _TaskFormSheetState();
}

class _TaskFormSheetState extends State<TaskFormSheet> {
  late final TextEditingController _titleController;
  late final TextEditingController _descController;
  DateTime? _dueDate;
  TaskPriority _priority = TaskPriority.medium;

  bool get _isEditing => widget.task != null;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.task?.title ?? '');
    _descController = TextEditingController(text: widget.task?.description ?? '');
    _dueDate = widget.task?.dueDate;
    _priority = widget.task?.priority ?? TaskPriority.medium;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _submit() {
    final title = _titleController.text.trim();
    if (title.isEmpty) return;

    final bloc = context.read<TasksBloc>();

    if (_isEditing) {
      bloc.add(TasksUpdate(
        id: widget.task!.id,
        title: title,
        description: _descController.text.trim().isEmpty ? null : _descController.text.trim(),
        dueDate: _dueDate,
        priority: _priority,
      ));
    } else {
      bloc.add(TasksCreate(
        title: title,
        description: _descController.text.trim().isEmpty ? null : _descController.text.trim(),
        dueDate: _dueDate,
        priority: _priority,
      ));
    }

    Navigator.pop(context);
  }

  Future<void> _pickDate() async {
    final date = await showDatePicker(
      context: context,
      initialDate: _dueDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (date != null) setState(() => _dueDate = date);
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.only(
        left: AppSpacing.lg,
        right: AppSpacing.lg,
        top: AppSpacing.md,
        bottom: MediaQuery.of(context).viewInsets.bottom + AppSpacing.lg,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: AppSpacing.lg),

          Text(
            _isEditing ? 'Edit Task' : 'New Task',
            style: AppTypography.h2,
          ),
          const SizedBox(height: AppSpacing.md),

          // Title
          TextField(
            controller: _titleController,
            autofocus: !_isEditing,
            style: AppTypography.body,
            decoration: const InputDecoration(hintText: 'What needs to be done?'),
          ),
          const SizedBox(height: AppSpacing.md),

          // Description
          TextField(
            controller: _descController,
            style: AppTypography.bodySmall,
            maxLines: 2,
            decoration: const InputDecoration(hintText: 'Notes (optional)'),
          ),
          const SizedBox(height: AppSpacing.md),

          // Date + Priority row
          Row(
            children: [
              // Due date
              Expanded(
                child: GestureDetector(
                  onTap: _pickDate,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      border: Border.all(color: AppColors.border),
                      borderRadius: BorderRadius.circular(AppSpacing.inputRadius),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.calendar_today, size: 18, color: AppColors.textSecondary),
                        const SizedBox(width: AppSpacing.sm),
                        Text(
                          _dueDate != null
                              ? DateFormat('MMM d').format(_dueDate!)
                              : 'Due date',
                          style: AppTypography.bodySmall,
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.md),

              // Priority
              SegmentedButton<TaskPriority>(
                segments: const [
                  ButtonSegment(value: TaskPriority.low, label: Text('L')),
                  ButtonSegment(value: TaskPriority.medium, label: Text('M')),
                  ButtonSegment(value: TaskPriority.high, label: Text('H')),
                ],
                selected: {_priority},
                onSelectionChanged: (s) => setState(() => _priority = s.first),
                style: ButtonStyle(
                  visualDensity: VisualDensity.compact,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.lg),

          // Submit
          SizedBox(
            width: double.infinity,
            height: AppSpacing.buttonHeight,
            child: ElevatedButton(
              onPressed: _titleController.text.trim().isNotEmpty ? _submit : null,
              child: Text(_isEditing ? 'Save Changes' : 'Add Task'),
            ),
          ),
        ],
      ),
    );
  }
}
