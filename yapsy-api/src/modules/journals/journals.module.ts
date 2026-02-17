import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journal } from './entities/journal.entity';
import { User } from '../users/entities/user.entity';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { LlmProcessorService } from './llm-processor.service';
import { TasksModule } from '../tasks/tasks.module';
import { NotesModule } from '../notes/notes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journal, User]),
    TasksModule,
    NotesModule,
  ],
  controllers: [JournalsController],
  providers: [JournalsService, LlmProcessorService],
  exports: [JournalsService, LlmProcessorService],
})
export class JournalsModule {}
