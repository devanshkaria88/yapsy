import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PaginatedResult } from '../../common/dto/pagination.dto';
import { TaskPriority, TaskStatus } from '../../common/enums';
import {
  CreateTaskDto,
  RolloverTaskDto,
  TaskQueryDto,
  UpdateTaskDto,
} from './dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create({
      user_id: userId,
      title: dto.title,
      description: dto.description,
      scheduled_date: dto.scheduled_date,
      priority: dto.priority ?? TaskPriority.MEDIUM,
      source: dto.source ?? 'manual',
    });
    return this.taskRepository.save(task);
  }

  async findAll(
    userId: string,
    query: TaskQueryDto,
  ): Promise<PaginatedResult<Task>> {
    const { page = 1, limit = 20, date, status, from, to, priority } = query;

    const qb = this.taskRepository
      .createQueryBuilder('task')
      .where('task.user_id = :userId', { userId })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('task.scheduled_date', 'ASC')
      .addOrderBy('task.priority', 'DESC');

    if (date) {
      qb.andWhere('task.scheduled_date = :date', { date });
    }
    if (status) {
      qb.andWhere('task.status = :status', { status });
    }
    if (from) {
      qb.andWhere('task.scheduled_date >= :from', { from });
    }
    if (to) {
      qb.andWhere('task.scheduled_date <= :to', { to });
    }
    if (priority) {
      qb.andWhere('task.priority = :priority', { priority });
    }

    const [items, total] = await qb.getManyAndCount();
    return new PaginatedResult(items, total, page, limit);
  }

  async findToday(userId: string): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.taskRepository.find({
      where: { user_id: userId, scheduled_date: today },
      order: { scheduled_date: 'ASC', priority: 'DESC' },
    });
  }

  async findOverdue(userId: string): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.taskRepository.find({
      where: {
        user_id: userId,
        status: TaskStatus.PENDING,
      },
      order: { scheduled_date: 'ASC', priority: 'DESC' },
    }).then((tasks) =>
      tasks.filter((t) => t.scheduled_date < today),
    );
  }

  async findUpcoming(userId: string): Promise<Task[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fromDate = tomorrow.toISOString().split('T')[0];

    const endDate = new Date(tomorrow);
    endDate.setDate(endDate.getDate() + 14);
    const toDate = endDate.toISOString().split('T')[0];

    return this.taskRepository
      .createQueryBuilder('task')
      .where('task.user_id = :userId', { userId })
      .andWhere('task.scheduled_date >= :fromDate', { fromDate })
      .andWhere('task.scheduled_date <= :toDate', { toDate })
      .orderBy('task.scheduled_date', 'ASC')
      .addOrderBy('task.priority', 'DESC')
      .getMany();
  }

  async findCalendarMonth(
    userId: string,
    year: number,
    month: number,
  ): Promise<Task[]> {
    const fromDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const toDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    return this.taskRepository
      .createQueryBuilder('task')
      .where('task.user_id = :userId', { userId })
      .andWhere('task.scheduled_date >= :fromDate', { fromDate })
      .andWhere('task.scheduled_date <= :toDate', { toDate })
      .orderBy('task.scheduled_date', 'ASC')
      .addOrderBy('task.priority', 'DESC')
      .getMany();
  }

  async findOne(userId: string, taskId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, user_id: userId },
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(
    userId: string,
    taskId: string,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne(userId, taskId);
    Object.assign(task, dto);
    return this.taskRepository.save(task);
  }

  async complete(userId: string, taskId: string): Promise<Task> {
    const task = await this.findOne(userId, taskId);
    task.status = TaskStatus.COMPLETED;
    task.completed_at = new Date();
    return this.taskRepository.save(task);
  }

  async rollover(
    userId: string,
    taskId: string,
    dto: RolloverTaskDto,
  ): Promise<Task> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const taskRepo = queryRunner.manager.getRepository(Task);
      const originalTask = await taskRepo.findOne({
        where: { id: taskId, user_id: userId },
      });

      if (!originalTask) {
        throw new NotFoundException('Task not found');
      }
      if (originalTask.status !== TaskStatus.PENDING) {
        throw new BadRequestException(
          'Only pending tasks can be rolled over',
        );
      }

      originalTask.status = TaskStatus.ROLLED_OVER;
      await taskRepo.save(originalTask);

      const newTask = taskRepo.create({
        user_id: userId,
        title: originalTask.title,
        description: originalTask.description,
        scheduled_date: dto.new_date,
        priority: originalTask.priority,
        status: TaskStatus.PENDING,
        rolled_from_id: originalTask.id,
        source: 'rollover',
      });
      const savedTask = await taskRepo.save(newTask);

      await queryRunner.commitTransaction();
      return savedTask;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(userId: string, taskId: string): Promise<void> {
    const task = await this.findOne(userId, taskId);
    await this.taskRepository.softRemove(task);
  }

  async findByIdForLLM(taskId: string, userId: string): Promise<Task | null> {
    return this.taskRepository.findOne({
      where: { id: taskId, user_id: userId },
    });
  }

  async findTodayTasksForContext(userId: string): Promise<Task[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.taskRepository.find({
      where: {
        user_id: userId,
        scheduled_date: today,
        status: TaskStatus.PENDING,
      },
      order: { priority: 'DESC' },
    });
  }
}
