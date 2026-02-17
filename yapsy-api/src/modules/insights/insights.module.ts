import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journal } from '../journals/entities/journal.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { JournalsModule } from '../journals/journals.module';
import { TasksModule } from '../tasks/tasks.module';
import { MoodInsight } from './entities/mood-insight.entity';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoodInsight, Journal, Task, User]),
    JournalsModule,
    TasksModule,
  ],
  controllers: [InsightsController],
  providers: [InsightsService],
  exports: [InsightsService],
})
export class InsightsModule {}
