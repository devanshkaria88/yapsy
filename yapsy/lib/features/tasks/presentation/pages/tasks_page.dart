import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/yapsy_empty_state.dart';
import '../../../../core/widgets/yapsy_error_state.dart';
import '../bloc/tasks_bloc.dart';
import '../widgets/task_card.dart';
import '../widgets/task_form_sheet.dart';

/// Tasks page with Today / Upcoming / Calendar tabs.
class TasksPage extends StatefulWidget {
  const TasksPage({super.key});

  @override
  State<TasksPage> createState() => _TasksPageState();
}

class _TasksPageState extends State<TasksPage> {
  @override
  void initState() {
    super.initState();
    final bloc = context.read<TasksBloc>();
    bloc.add(const TasksLoadToday());
    bloc.add(const TasksLoadOverdue());
    bloc.add(const TasksLoadUpcoming());
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: const Text('Tasks'),
          bottom: TabBar(
            indicatorColor: AppColors.primary,
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.textSecondary,
            labelStyle: AppTypography.label,
            tabs: const [
              Tab(text: 'Today'),
              Tab(text: 'Upcoming'),
              Tab(text: 'Overdue'),
            ],
          ),
        ),
        body: BlocConsumer<TasksBloc, TasksState>(
          listener: (context, state) {
            if (state is TasksActionSuccess) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(state.message)),
              );
            }
            if (state is TasksError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(state.message)),
              );
            }
          },
          buildWhen: (_, current) => current is TasksLoaded || current is TasksLoading || current is TasksError,
          builder: (context, state) {
            if (state is TasksLoading) {
              return const Center(child: CircularProgressIndicator());
            }
            if (state is TasksError) {
              return YapsyErrorState(
                message: state.message,
                onRetry: () {
                  context.read<TasksBloc>().add(const TasksLoadToday());
                },
              );
            }
            if (state is TasksLoaded) {
              return TabBarView(
                children: [
                  _TaskListView(
                    tasks: state.todayTasks,
                    emptyIcon: Icons.check_circle_outline_rounded,
                    emptyTitle: 'No tasks for today',
                    emptySubtitle: 'Tap + to add a task or complete a voice check-in',
                  ),
                  _TaskListView(
                    tasks: state.upcomingTasks,
                    emptyIcon: Icons.upcoming_rounded,
                    emptyTitle: 'No upcoming tasks',
                    emptySubtitle: 'Tasks due in the future will appear here',
                  ),
                  _TaskListView(
                    tasks: state.overdueTasks,
                    emptyIcon: Icons.warning_amber_rounded,
                    emptyTitle: 'All caught up!',
                    emptySubtitle: 'No overdue tasks',
                    showRollover: true,
                  ),
                ],
              );
            }
            return const SizedBox.shrink();
          },
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () => TaskFormSheet.show(context),
          backgroundColor: AppColors.primary,
          child: const Icon(Icons.add, color: Colors.white),
        ),
      ),
    );
  }
}

class _TaskListView extends StatelessWidget {
  final List<dynamic> tasks;
  final IconData emptyIcon;
  final String emptyTitle;
  final String? emptySubtitle;
  final bool showRollover;

  const _TaskListView({
    required this.tasks,
    required this.emptyIcon,
    required this.emptyTitle,
    this.emptySubtitle,
    this.showRollover = false,
  });

  @override
  Widget build(BuildContext context) {
    if (tasks.isEmpty) {
      return YapsyEmptyState(
        icon: emptyIcon,
        title: emptyTitle,
        subtitle: emptySubtitle,
      );
    }

    return RefreshIndicator(
      onRefresh: () async {
        context.read<TasksBloc>().add(const TasksLoadToday());
        context.read<TasksBloc>().add(const TasksLoadOverdue());
        context.read<TasksBloc>().add(const TasksLoadUpcoming());
      },
      child: ListView.separated(
        padding: const EdgeInsets.all(AppSpacing.md),
        itemCount: tasks.length,
        separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
        itemBuilder: (context, index) {
          final task = tasks[index];
          return TaskCard(
            task: task,
            onComplete: () => context.read<TasksBloc>().add(TasksComplete(task.id)),
            onDelete: () => context.read<TasksBloc>().add(TasksDelete(task.id)),
            onRollover: showRollover ? () => context.read<TasksBloc>().add(TasksRollover(task.id)) : null,
            onTap: () => TaskFormSheet.show(context, task: task),
          );
        },
      ),
    );
  }
}
