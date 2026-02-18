import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { WaitlistEntry } from './entities/waitlist-entry.entity';
import { CreateWaitlistEntryDto } from './dto';

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);

  constructor(
    @InjectRepository(WaitlistEntry)
    private readonly waitlistRepo: Repository<WaitlistEntry>,
    private readonly configService: ConfigService,
  ) {}

  async signup(
    dto: CreateWaitlistEntryDto,
    ipAddress?: string,
  ): Promise<WaitlistEntry> {
    const existing = await this.waitlistRepo.findOne({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException({
        code: 'ALREADY_ON_WAITLIST',
        message: "You're already on the waitlist!",
      });
    }

    const entry = this.waitlistRepo.create({
      email: dto.email,
      country: dto.country || 'UNKNOWN',
      utm_source: dto.utm_source,
      utm_medium: dto.utm_medium,
      utm_campaign: dto.utm_campaign,
      ip_address: ipAddress,
    });

    const saved = await this.waitlistRepo.save(entry);

    this.logger.log(
      `[Waitlist] New signup: ${dto.email} | Country: ${entry.country}`,
    );

    // Optionally sync to Resend audience (fire-and-forget)
    this.syncToResend(saved).catch((err: unknown) =>
      this.logger.warn(
        `[Waitlist] Resend sync failed for ${dto.email}: ${err instanceof Error ? err.message : String(err)}`,
      ),
    );

    return saved;
  }

  private async syncToResend(entry: WaitlistEntry): Promise<void> {
    const apiKey = this.configService.get<string>('resend.apiKey');
    const audienceId = this.configService.get<string>('resend.audienceId');

    if (!apiKey || !audienceId) {
      return;
    }

    try {
      const { Resend } = await import('resend');
      const resend = new Resend(apiKey);

      await resend.contacts.create({
        email: entry.email,
        audienceId,
        firstName: '',
        lastName: '',
        unsubscribed: false,
      });

      await this.waitlistRepo.update(entry.id, { synced_to_resend: true });
      this.logger.log(`[Waitlist] Synced to Resend: ${entry.email}`);
    } catch (err: unknown) {
      this.logger.warn(
        `[Waitlist] Resend API error: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  async getCount(): Promise<number> {
    return this.waitlistRepo.count();
  }
}
