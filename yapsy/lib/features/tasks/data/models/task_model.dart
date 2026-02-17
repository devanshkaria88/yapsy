import '../../domain/entities/task.dart';

/// DTO that maps between API JSON and domain [Task] entity.
class TaskModel {
  final String id;
  final String title;
  final String? description;
  final String? dueDate;
  final String status;
  final String priority;
  final String source;
  final String? conversationId;
  final bool isRolledOver;
  final String createdAt;
  final String updatedAt;

  const TaskModel({
    required this.id,
    required this.title,
    this.description,
    this.dueDate,
    required this.status,
    required this.priority,
    required this.source,
    this.conversationId,
    this.isRolledOver = false,
    required this.createdAt,
    required this.updatedAt,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String?,
      dueDate: json['due_date'] as String?,
      status: json['status'] as String? ?? 'pending',
      priority: json['priority'] as String? ?? 'medium',
      source: json['source'] as String? ?? 'manual',
      conversationId: json['conversation_id'] as String?,
      isRolledOver: json['is_rolled_over'] as bool? ?? false,
      createdAt: json['created_at'] as String,
      updatedAt: json['updated_at'] as String,
    );
  }

  Task toEntity() {
    return Task(
      id: id,
      title: title,
      description: description,
      dueDate: dueDate != null ? DateTime.parse(dueDate!) : null,
      status: _parseStatus(status),
      priority: _parsePriority(priority),
      source: source == 'voice' ? TaskSource.voice : TaskSource.manual,
      conversationId: conversationId,
      isRolledOver: isRolledOver,
      createdAt: DateTime.parse(createdAt),
      updatedAt: DateTime.parse(updatedAt),
    );
  }

  static TaskStatus _parseStatus(String s) => switch (s) {
    'completed' => TaskStatus.completed,
    'cancelled' => TaskStatus.cancelled,
    _ => TaskStatus.pending,
  };

  static TaskPriority _parsePriority(String s) => switch (s) {
    'high' => TaskPriority.high,
    'low' => TaskPriority.low,
    _ => TaskPriority.medium,
  };
}
