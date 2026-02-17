import 'package:dartz/dartz.dart' hide Task;
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/task.dart';
import '../repositories/task_repository.dart';

class UpdateTask extends UseCase<Task, UpdateTaskParams> {
  final TaskRepository repository;
  UpdateTask(this.repository);

  @override
  Future<Either<Failure, Task>> call(UpdateTaskParams params) =>
      repository.updateTask(
        id: params.id,
        title: params.title,
        description: params.description,
        dueDate: params.dueDate,
        priority: params.priority,
      );
}

class UpdateTaskParams extends Equatable {
  final String id;
  final String? title;
  final String? description;
  final DateTime? dueDate;
  final TaskPriority? priority;

  const UpdateTaskParams({
    required this.id,
    this.title,
    this.description,
    this.dueDate,
    this.priority,
  });

  @override
  List<Object?> get props => [id, title, description, dueDate, priority];
}
