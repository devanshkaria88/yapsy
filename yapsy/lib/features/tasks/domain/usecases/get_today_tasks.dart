import 'package:dartz/dartz.dart' hide Task;
import '../../../../core/error/failures.dart';
import '../../../../core/usecase/usecase.dart';
import '../entities/task.dart';
import '../repositories/task_repository.dart';

class GetTodayTasks extends UseCase<List<Task>, NoParams> {
  final TaskRepository repository;
  GetTodayTasks(this.repository);

  @override
  Future<Either<Failure, List<Task>>> call(NoParams params) =>
      repository.getTodayTasks();
}
