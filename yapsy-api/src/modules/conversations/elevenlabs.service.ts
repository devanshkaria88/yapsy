import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ElevenlabsService {
  constructor(private readonly configService: ConfigService) {}

  async getSignedUrl(): Promise<{ signed_url: string }> {
    const agentId = this.configService.get<string>('elevenlabs.agentId');
    const apiKey = this.configService.get<string>('elevenlabs.apiKey');

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: { 'xi-api-key': apiKey || '' },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to get ElevenLabs signed URL');
    }

    const data = (await response.json()) as { signed_url: string };
    return { signed_url: data.signed_url };
  }

  buildSessionConfig(user: User, tasks: Task[]): Record<string, unknown> {
    const todayTasksPrompt = tasks.length
      ? tasks
          .map((t) => `- [${t.id}] ${t.title} (${t.status}, ${t.priority})`)
          .join('\n')
      : 'No tasks scheduled for today.';

    const systemPrompt = `You are a supportive voice assistant for ${user.name}.

User context:
- Timezone: ${user.timezone}
- Today's tasks:
${todayTasksPrompt}

Be warm, empathetic, and helpful. Guide the user through their check-in.`;

    return {
      agent_id: this.configService.get<string>('elevenlabs.agentId'),
      system_prompt: systemPrompt,
    };
  }
}
