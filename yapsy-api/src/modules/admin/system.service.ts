import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookEvent } from '../subscriptions/entities/webhook-event.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(WebhookEvent)
    private readonly webhookRepo: Repository<WebhookEvent>,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async getHealth(): Promise<{
    api: 'healthy' | 'degraded' | 'down';
    database: 'healthy' | 'degraded' | 'down';
    elevenlabs: 'healthy' | 'degraded' | 'down';
    razorpay: 'healthy' | 'degraded' | 'down';
    uptime: number;
    timestamp: string;
  }> {
    let database: 'healthy' | 'down' = 'down';
    try {
      await this.webhookRepo.manager.query('SELECT 1');
      database = 'healthy';
    } catch {
      database = 'down';
    }

    // ElevenLabs and Razorpay — report healthy if env vars are configured,
    // degraded if not. A real ping can be added later.
    const elevenlabs = process.env.ELEVENLABS_API_KEY ? 'healthy' : 'degraded';
    const razorpay =
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
        ? 'healthy'
        : 'degraded';

    return {
      api: 'healthy',
      database,
      elevenlabs: elevenlabs as 'healthy' | 'degraded' | 'down',
      razorpay: razorpay as 'healthy' | 'degraded' | 'down',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  getCosts(): {
    elevenlabs: { requests: number; cost: number };
    gemini: { requests: number; cost: number };
  } {
    // Placeholder — wire up real cost tracking when available
    return {
      elevenlabs: { requests: 0, cost: 0 },
      gemini: { requests: 0, cost: 0 },
    };
  }

  async getErrors(limit: number): Promise<WebhookEvent[]> {
    return this.webhookRepo
      .createQueryBuilder('w')
      .where('w.processed = :processed', { processed: false })
      .orWhere('w.error IS NOT NULL')
      .orderBy('w.received_at', 'DESC')
      .take(limit)
      .getMany();
  }

  async getWebhooks(limit: number): Promise<WebhookEvent[]> {
    return this.webhookRepo.find({
      order: { received_at: 'DESC' },
      take: limit,
    });
  }

  async retryWebhook(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const webhook = await this.webhookRepo.findOne({ where: { id } });
    if (!webhook) {
      throw new NotFoundException('Webhook event not found');
    }

    await this.subscriptionsService.retryWebhook(id);
    return { success: true, message: 'Webhook reprocessed successfully' };
  }
}
