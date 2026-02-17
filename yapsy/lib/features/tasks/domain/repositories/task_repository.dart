import 'package:dartz/dartz.dart' hide Task;
import '../../../../core/error/failures.dart';
import '../entities/task.dart';

/// Task repository contract.
abstract class TaskRepository {
  Future<Either<Failure, List<Task>>> getTodayTasks();
  Future<Either<Failure, List<Task>>> getOverdueTasks();
  Future<Either<Failure, List<Task>>> getUpcomingTasks();
  Future<Either<Failure, Map<String, dynamic>>> getCalendarData(int year, int month);
  Future<Either<Failure, Task>> getTaskById(String id);
  Future<Either<Failure, Task>> createTask({
    required String title,
    String? description,
    DateTime? dueDate,
    TaskPriority? priority,
  });
  Future<Either<Failure, Task>> updateTask({
    required String id,
    String? title,
    String? description,
    DateTime? dueDate,
    TaskPriority? priority,
  });
  Future<Either<Failure, Task>> completeTask(String id);
  Future<Either<Failure, Task>> rolloverTask(String id);
  Future<Either<Failure, void>> deleteTask(String id);
}
