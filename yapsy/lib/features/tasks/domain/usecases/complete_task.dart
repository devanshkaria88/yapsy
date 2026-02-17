import 'package:dartz/dartz.dart' hide Task;
import 'package:equatable/equatable.dart';
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/task.dart';
import '../repositories/task_repository.dart';

class CompleteTask extends UseCase<Task, CompleteTaskParams> {
  final TaskRepository repository;
  CompleteTask(this.repository);

  @override
  Future<Either<Failure, Task>> call(CompleteTaskParams params) =>
      repository.completeTask(params.id);
}

class CompleteTaskParams extends Equatable {
  final String id;
  const CompleteTaskParams(this.id);

  @override
  List<Object?> get props => [id];
}
