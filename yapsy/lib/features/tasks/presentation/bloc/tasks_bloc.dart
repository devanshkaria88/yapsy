import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/usecase/usecase.dart';
import '../../domain/entities/task.dart';
import '../../domain/usecases/complete_task.dart';
import '../../domain/usecases/create_task.dart';
import '../../domain/usecases/delete_task.dart';
import '../../domain/usecases/get_overdue_tasks.dart';
import '../../domain/usecases/get_today_tasks.dart';
import '../../domain/usecases/get_upcoming_tasks.dart';
import '../../domain/usecases/rollover_task.dart';
import '../../domain/usecases/update_task.dart';

// ─── Events ──────────────────────────────────────────────

abstract class TasksEvent extends Equatable {
  const TasksEvent();
  @override
  List<Object?> get props => [];
}

class TasksLoadToday extends TasksEvent {
  const TasksLoadToday();
}

class TasksLoadUpcoming extends TasksEvent {
  const TasksLoadUpcoming();
}

class TasksLoadOverdue extends TasksEvent {
  const TasksLoadOverdue();
}

class TasksCreate extends TasksEvent {
  final String title;
  final String? description;
  final DateTime? dueDate;
  final TaskPriority? priority;

  const TasksCreate({
    required this.title,
    this.description,
    this.dueDate,
    this.priority,
  });

  @override
  List<Object?> get props => [title, description, dueDate, priority];
}

class TasksUpdate extends TasksEvent {
  final String id;
  final String? title;
  final String? description;
  final DateTime? dueDate;
  final TaskPriority? priority;

  const TasksUpdate({
    required this.id,
    this.title,
    this.description,
    this.dueDate,
    this.priority,
  });

  @override
  List<Object?> get props => [id, title, description, dueDate, priority];
}

class TasksComplete extends TasksEvent {
  final String id;
  const TasksComplete(this.id);
  @override
  List<Object?> get props => [id];
}

class TasksRollover extends TasksEvent {
  final String id;
  const TasksRollover(this.id);
  @override
  List<Object?> get props => [id];
}

class TasksDelete extends TasksEvent {
  final String id;
  const TasksDelete(this.id);
  @override
  List<Object?> get props => [id];
}

// ─── States ──────────────────────────────────────────────

abstract class TasksState extends Equatable {
  const TasksState();
  @override
  List<Object?> get props => [];
}

class TasksInitial extends TasksState {
  const TasksInitial();
}

class TasksLoading extends TasksState {
  const TasksLoading();
}

class TasksLoaded extends TasksState {
  final List<Task> todayTasks;
  final List<Task> upcomingTasks;
  final List<Task> overdueTasks;

  const TasksLoaded({
    this.todayTasks = const [],
    this.upcomingTasks = const [],
    this.overdueTasks = const [],
  });

  TasksLoaded copyWith({
    List<Task>? todayTasks,
    List<Task>? upcomingTasks,
    List<Task>? overdueTasks,
  }) {
    return TasksLoaded(
      todayTasks: todayTasks ?? this.todayTasks,
      upcomingTasks: upcomingTasks ?? this.upcomingTasks,
      overdueTasks: overdueTasks ?? this.overdueTasks,
    );
  }

  @override
  List<Object?> get props => [todayTasks, upcomingTasks, overdueTasks];
}

class TasksError extends TasksState {
  final String message;
  const TasksError(this.message);
  @override
  List<Object?> get props => [message];
}

class TasksActionSuccess extends TasksState {
  final String message;
  const TasksActionSuccess(this.message);
  @override
  List<Object?> get props => [message];
}

// ─── BLoC ────────────────────────────────────────────────

class TasksBloc extends Bloc<TasksEvent, TasksState> {
  final GetTodayTasks _getTodayTasks;
  final GetUpcomingTasks _getUpcomingTasks;
  final GetOverdueTasks _getOverdueTasks;
  final CreateTask _createTask;
  final UpdateTask _updateTask;
  final CompleteTask _completeTask;
  final RolloverTask _rolloverTask;
  final DeleteTask _deleteTask;

  TasksBloc({
    required GetTodayTasks getTodayTasks,
    required GetUpcomingTasks getUpcomingTasks,
    required GetOverdueTasks getOverdueTasks,
    required CreateTask createTask,
    required UpdateTask updateTask,
    required CompleteTask completeTask,
    required RolloverTask rolloverTask,
    required DeleteTask deleteTask,
  })  : _getTodayTasks = getTodayTasks,
        _getUpcomingTasks = getUpcomingTasks,
        _getOverdueTasks = getOverdueTasks,
        _createTask = createTask,
        _updateTask = updateTask,
        _completeTask = completeTask,
        _rolloverTask = rolloverTask,
        _deleteTask = deleteTask,
        super(const TasksInitial()) {
    on<TasksLoadToday>(_onLoadToday);
    on<TasksLoadUpcoming>(_onLoadUpcoming);
    on<TasksLoadOverdue>(_onLoadOverdue);
    on<TasksCreate>(_onCreate);
    on<TasksUpdate>(_onUpdate);
    on<TasksComplete>(_onComplete);
    on<TasksRollover>(_onRollover);
    on<TasksDelete>(_onDelete);
  }

  Future<void> _onLoadToday(TasksLoadToday event, Emitter<TasksState> emit) async {
    final current = state is TasksLoaded ? state as TasksLoaded : null;
    if (current == null) emit(const TasksLoading());

    final result = await _getTodayTasks(const NoParams());
    result.fold(
      (f) => emit(TasksError(f.message)),
      (tasks) {
        final overdueResult = current?.overdueTasks ?? [];
        final upcomingResult = current?.upcomingTasks ?? [];
        emit(TasksLoaded(todayTasks: tasks, overdueTasks: overdueResult, upcomingTasks: upcomingResult));
      },
    );
  }

  Future<void> _onLoadUpcoming(TasksLoadUpcoming event, Emitter<TasksState> emit) async {
    final current = state is TasksLoaded ? state as TasksLoaded : null;
    if (current == null) emit(const TasksLoading());

    final result = await _getUpcomingTasks(const NoParams());
    result.fold(
      (f) => emit(TasksError(f.message)),
      (tasks) => emit((current ?? const TasksLoaded()).copyWith(upcomingTasks: tasks)),
    );
  }

  Future<void> _onLoadOverdue(TasksLoadOverdue event, Emitter<TasksState> emit) async {
    final current = state is TasksLoaded ? state as TasksLoaded : null;
    if (current == null) emit(const TasksLoading());

    final result = await _getOverdueTasks(const NoParams());
    result.fold(
      (f) => emit(TasksError(f.message)),
      (tasks) => emit((current ?? const TasksLoaded()).copyWith(overdueTasks: tasks)),
    );
  }

  Future<void> _onCreate(TasksCreate event, Emitter<TasksState> emit) async {
    final result = await _createTask(CreateTaskParams(
      title: event.title,
      description: event.description,
      dueDate: event.dueDate,
      priority: event.priority,
    ));
    result.fold(
      (f) => emit(TasksError(f.message)),
      (_) {
        emit(const TasksActionSuccess('Task created'));
        add(const TasksLoadToday());
      },
    );
  }

  Future<void> _onUpdate(TasksUpdate event, Emitter<TasksState> emit) async {
    final result = await _updateTask(UpdateTaskParams(
      id: event.id,
      title: event.title,
      description: event.description,
      dueDate: event.dueDate,
      priority: event.priority,
    ));
    result.fold(
      (f) => emit(TasksError(f.message)),
      (_) {
        emit(const TasksActionSuccess('Task updated'));
        add(const TasksLoadToday());
      },
    );
  }

  Future<void> _onComplete(TasksComplete event, Emitter<TasksState> emit) async {
    final result = await _completeTask(CompleteTaskParams(event.id));
    result.fold(
      (f) => emit(TasksError(f.message)),
      (_) {
        emit(const TasksActionSuccess('Task completed!'));
        add(const TasksLoadToday());
      },
    );
  }

  Future<void> _onRollover(TasksRollover event, Emitter<TasksState> emit) async {
    final result = await _rolloverTask(RolloverTaskParams(event.id));
    result.fold(
      (f) => emit(TasksError(f.message)),
      (_) {
        emit(const TasksActionSuccess('Task rolled over to today'));
        add(const TasksLoadToday());
        add(const TasksLoadOverdue());
      },
    );
  }

  Future<void> _onDelete(TasksDelete event, Emitter<TasksState> emit) async {
    final result = await _deleteTask(DeleteTaskParams(event.id));
    result.fold(
      (f) => emit(TasksError(f.message)),
      (_) {
        emit(const TasksActionSuccess('Task deleted'));
        add(const TasksLoadToday());
      },
    );
  }
}
