import 'package:dartz/dartz.dart' hide Task;
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/task.dart';
import '../repositories/task_repository.dart';

class CreateTask extends UseCase<Task, CreateTaskParams> {
  final TaskRepository repository;
  CreateTask(this.repository);

  @override
  Future<Either<Failure, Task>> call(CreateTaskParams params) =>
      repository.createTask(
        title: params.title,
        description: params.description,
        dueDate: params.dueDate,
        priority: params.priority,
      );
}

class CreateTaskParams extends Equatable {
  final String title;
  final String? description;
  final DateTime? dueDate;
  final TaskPriority? priority;

  const CreateTaskParams({
    required this.title,
    this.description,
    this.dueDate,
    this.priority,
  });

  @override
  List<Object?> get props => [title, description, dueDate, priority];
}
