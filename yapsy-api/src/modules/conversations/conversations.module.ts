import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Journal } from '../journals/entities/journal.entity';
import { User } from '../users/entities/user.entity';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import { ElevenlabsService } from './elevenlabs.service';
import { TasksModule } from '../tasks/tasks.module';
import { JournalsModule } from '../journals/journals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Journal, User]),
    TasksModule,
    JournalsModule,
  ],
  controllers: [ConversationsController],
  providers: [ConversationsService, ElevenlabsService],
})
export class ConversationsModule {}
