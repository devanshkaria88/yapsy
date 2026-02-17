import 'package:equatable/equatable.dart';

enum TaskStatus { pending, completed, cancelled }
enum TaskPriority { low, medium, high }
enum TaskSource { manual, voice }

/// Domain entity for a task.
class Task extends Equatable {
  final String id;
  final String title;
  final String? description;
  final DateTime? dueDate;
  final TaskStatus status;
  final TaskPriority priority;
  final TaskSource source;
  final String? conversationId;
  final bool isRolledOver;
  final DateTime createdAt;
  final DateTime updatedAt;

  const Task({
    required this.id,
    required this.title,
    this.description,
    this.dueDate,
    this.status = TaskStatus.pending,
    this.priority = TaskPriority.medium,
    this.source = TaskSource.manual,
    this.conversationId,
    this.isRolledOver = false,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isCompleted => status == TaskStatus.completed;
  bool get isPending => status == TaskStatus.pending;
  bool get isOverdue =>
      dueDate != null &&
      dueDate!.isBefore(DateTime.now()) &&
      status == TaskStatus.pending;

  Task copyWith({
    String? id,
    String? title,
    String? description,
    DateTime? dueDate,
    TaskStatus? status,
    TaskPriority? priority,
    TaskSource? source,
    String? conversationId,
    bool? isRolledOver,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Task(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      dueDate: dueDate ?? this.dueDate,
      status: status ?? this.status,
      priority: priority ?? this.priority,
      source: source ?? this.source,
      conversationId: conversationId ?? this.conversationId,
      isRolledOver: isRolledOver ?? this.isRolledOver,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  List<Object?> get props => [id, title, description, dueDate, status, priority, source, isRolledOver, createdAt, updatedAt];
}
