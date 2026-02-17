import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Journal } from '../journals/entities/journal.entity';
import { SubscriptionStatus } from '../../common/enums';
import { ElevenlabsService } from './elevenlabs.service';
import { TasksService } from '../tasks/tasks.service';
import { LlmProcessorService } from '../journals/llm-processor.service';
import { SaveConversationDto } from './dto';

@Injectable()
export class ConversationsService {
  private readonly FREE_WEEKLY_LIMIT = 3;

  constructor(
    @InjectRepository(Journal)
    private readonly journalsRepo: Repository<Journal>,
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly elevenlabsService: ElevenlabsService,
    private readonly tasksService: TasksService,
    private readonly llmProcessor: LlmProcessorService,
  ) {}

  async prepareSession(userId: string): Promise<{
    signed_url: string;
    session_config: Record<string, unknown>;
  }> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Free tier limit logic
    const today = new Date().toISOString().split('T')[0];
    let resetDate = user.weekly_check_in_reset_date;
    let weeklyCount = user.weekly_check_in_count ?? 0;

    if (!resetDate || today >= resetDate) {
      weeklyCount = 0;
      resetDate = this.getNextMonday();
      await this.usersRepo.update(userId, {
        weekly_check_in_count: 0,
        weekly_check_in_reset_date: resetDate,
      });
    }

    if (
      user.subscription_status === SubscriptionStatus.FREE &&
      weeklyCount >= this.FREE_WEEKLY_LIMIT
    ) {
      throw new HttpException(
        { code: 'WEEKLY_LIMIT_REACHED', message: 'Weekly check-in limit reached' },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    // Increment count
    await this.usersRepo.update(userId, {
      weekly_check_in_count: weeklyCount + 1,
    });

    const [signedUrlResult, todayTasks] = await Promise.all([
      this.elevenlabsService.getSignedUrl(),
      this.tasksService.findTodayTasksForContext(userId),
    ]);

    const sessionConfig = this.elevenlabsService.buildSessionConfig(
      user,
      todayTasks,
    );

    return {
      signed_url: signedUrlResult.signed_url,
      session_config: sessionConfig,
    };
  }

  async saveConversation(
    userId: string,
    dto: SaveConversationDto,
  ): Promise<Journal> {
    const date = dto.date ?? new Date().toISOString().split('T')[0];

    const journal = this.journalsRepo.create({
      user_id: userId,
      date,
      elevenlabs_conversation_id: dto.conversation_id,
      duration_seconds: dto.duration_seconds,
      transcript: dto.transcript as unknown[],
      processing_status: 'processing',
    });

    const saved = await this.journalsRepo.save(journal);

    // Kick off async LLM processing (don't await)
    this.llmProcessor
      .processTranscript(saved.id, userId, dto.transcript as unknown[])
      .catch(() => {
        // Error already logged in processTranscript
      });

    return saved;
  }

  async getProcessingStatus(
    userId: string,
    journalId: string,
  ): Promise<{ processing_status: string }> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(journalId)) {
      throw new HttpException('Invalid journal ID format', HttpStatus.BAD_REQUEST);
    }

    const journal = await this.journalsRepo.findOne({
      where: { id: journalId, user_id: userId },
    });

    if (!journal) {
      throw new HttpException('Journal not found', HttpStatus.NOT_FOUND);
    }

    return { processing_status: journal.processing_status };
  }

  private getNextMonday(): string {
    const d = new Date();
    const day = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const daysUntilMonday = day === 0 ? 1 : 8 - day; // Sun->1, Mon->7, Tue->6, etc.
    d.setDate(d.getDate() + daysUntilMonday);
    return d.toISOString().split('T')[0];
  }
}
