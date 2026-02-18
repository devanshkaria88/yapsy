import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GoogleGenerativeAI,
  SchemaType,
  type FunctionDeclaration,
} from '@google/generative-ai';
import { ConcernLevel, TaskPriority } from '../../common/enums';
import { Journal } from './entities/journal.entity';
import { User } from '../users/entities/user.entity';
import { TasksService } from '../tasks/tasks.service';
import { NotesService } from '../notes/notes.service';

@Injectable()
export class LlmProcessorService {
  private readonly logger = new Logger(LlmProcessorService.name);
  private genAI: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    private readonly tasksService: TasksService,
    private readonly notesService: NotesService,
    @InjectRepository(Journal)
    private readonly journalsRepo: Repository<Journal>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {
    const apiKey = this.configService.get<string>('gemini.apiKey') || '';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  private getToolDeclarations(): FunctionDeclaration[] {
    return [
      {
        name: 'create_task',
        description: 'Create a new task for the user',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            scheduled_date: {
              type: SchemaType.STRING,
              description: 'Date in YYYY-MM-DD format',
            },
            priority: {
              type: SchemaType.STRING,
              description: 'One of: low, medium, high',
            },
          },
          required: ['title', 'scheduled_date'],
        },
      },
      {
        name: 'complete_task',
        description: 'Mark a task as completed',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            task_id: { type: SchemaType.STRING },
          },
          required: ['task_id'],
        },
      },
      {
        name: 'reschedule_task',
        description: 'Reschedule a task to a new date',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            task_id: { type: SchemaType.STRING },
            new_date: {
              type: SchemaType.STRING,
              description: 'Date in YYYY-MM-DD format',
            },
            reason: { type: SchemaType.STRING },
          },
          required: ['task_id', 'new_date'],
        },
      },
      {
        name: 'add_note',
        description: 'Add a note for the user',
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            content: { type: SchemaType.STRING },
            follow_up_date: {
              type: SchemaType.STRING,
              description: 'Date in YYYY-MM-DD format',
            },
          },
          required: ['content'],
        },
      },
    ];
  }

  async processTranscript(
    journalId: string,
    userId: string,
    transcript: unknown[],
  ): Promise<void> {
    try {
      const todayTasks =
        await this.tasksService.findTodayTasksForContext(userId);
      const modelName =
        this.configService.get<string>('gemini.model') || 'gemini-2.0-flash';

      const systemPrompt = `You are analyzing a voice journal transcript. The user talked about their day.

Current tasks for context:
${todayTasks.map((t) => `- [${t.id}] ${t.title} (${t.status}, ${t.priority})`).join('\n')}

Analyze the transcript and:
1. Extract a mood score (1-10), mood label, summary, themes, wins, struggles, people mentioned, and concern level
2. Use tools to create/complete/reschedule tasks or add notes as appropriate

Return a JSON object with:
{
  "mood_score": number (1-10),
  "mood_label": string,
  "summary": string,
  "themes": string[],
  "wins": string[],
  "struggles": string[],
  "people_mentioned": string[],
  "concern_level": "low" | "medium" | "high"
}`;

      const model = this.genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: this.getToolDeclarations() }],
      });

      const result = await model.generateContent(
        `Here is the conversation transcript:\n\n${JSON.stringify(transcript)}`,
      );

      const response = result.response;
      const actionsTaken: {
        type: string;
        details: string;
        task_id?: string;
      }[] = [];
      let insights = {
        mood_score: 5,
        mood_label: 'neutral',
        summary: '',
        themes: [] as string[],
        wins: [] as string[],
        struggles: [] as string[],
        people_mentioned: [] as string[],
        concern_level: 'low' as string,
      };

      for (const candidate of response.candidates || []) {
        for (const part of candidate.content?.parts || []) {
          if (part.text) {
            try {
              const jsonMatch = part.text.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                insights = {
                  ...insights,
                  ...(JSON.parse(jsonMatch[0]) as Record<string, unknown>),
                };
              }
            } catch {
              /* ignore parse errors */
            }
          } else if (part.functionCall) {
            await this.executeToolCall(
              part.functionCall.name,
              (part.functionCall.args || {}) as Record<string, unknown>,
              userId,
              journalId,
              actionsTaken,
            );
          }
        }
      }

      await this.journalsRepo.update(journalId, {
        mood_score: insights.mood_score,
        mood_label: insights.mood_label,
        summary: insights.summary,
        themes: insights.themes,
        wins: insights.wins,
        struggles: insights.struggles,
        people_mentioned: insights.people_mentioned,
        concern_level: insights.concern_level as ConcernLevel,
        actions_taken: actionsTaken,
        processing_status: 'completed',
      });

      await this.updateUserStreak(userId);
    } catch (error) {
      this.logger.error(
        `Failed to process transcript for journal ${journalId}`,
        error,
      );
      await this.journalsRepo.update(journalId, {
        processing_status: 'failed',
      });
    }
  }

  private async executeToolCall(
    name: string,
    input: Record<string, unknown>,
    userId: string,
    journalId: string,
    actions: { type: string; details: string; task_id?: string }[],
  ): Promise<void> {
    switch (name) {
      case 'create_task': {
        const task = await this.tasksService.create(userId, {
          title: input.title as string,
          scheduled_date: input.scheduled_date as string,
          priority: (input.priority as TaskPriority) ?? TaskPriority.MEDIUM,
          source: 'voice',
        });
        actions.push({
          type: 'create_task',
          details: `Created task: ${task.title}`,
          task_id: task.id,
        });
        break;
      }
      case 'complete_task': {
        const taskId = input.task_id as string;
        await this.tasksService.complete(userId, taskId);
        actions.push({
          type: 'complete_task',
          details: `Completed task ${taskId}`,
          task_id: taskId,
        });
        break;
      }
      case 'reschedule_task': {
        const taskId = input.task_id as string;
        await this.tasksService.rollover(userId, taskId, {
          new_date: input.new_date as string,
        });
        actions.push({
          type: 'reschedule_task',
          details: `Rescheduled task to ${String(input.new_date)}`,
          task_id: taskId,
        });
        break;
      }
      case 'add_note': {
        await this.notesService.createFromVoice(
          userId,
          input.content as string,
          journalId,
          input.follow_up_date as string | undefined,
        );
        actions.push({
          type: 'add_note',
          details: `Added note: ${(input.content as string).substring(0, 50)}...`,
        });
        break;
      }
    }
  }

  private async updateUserStreak(userId: string): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];
    const lastCheckIn = user.last_check_in_date?.toString();

    if (lastCheckIn === yesterday) {
      user.current_streak += 1;
    } else if (lastCheckIn !== today) {
      user.current_streak = 1;
    }

    user.last_check_in_date = today as unknown as string;
    user.total_check_ins += 1;
    await this.usersRepo.save(user);
  }

  async generateWeeklyInsight(
    userId: string,
    journals: Journal[],
    taskCompletionRate: number,
  ): Promise<string> {
    const modelName =
      this.configService.get<string>('gemini.model') || 'gemini-2.0-flash';

    const journalSummaries = journals.map((j) => ({
      date: j.date,
      mood: j.mood_score,
      summary: j.summary,
      themes: j.themes,
      wins: j.wins,
      struggles: j.struggles,
    }));

    const model = this.genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(
      `Generate a warm, supportive weekly insight for this user based on their journal entries and ${taskCompletionRate}% task completion rate this week:\n\n${JSON.stringify(journalSummaries)}\n\nWrite 2-3 paragraphs that highlight patterns, celebrate wins, and gently address struggles. Be empathetic and encouraging.`,
    );

    return result.response.text() || 'Unable to generate insight this week.';
  }
}
