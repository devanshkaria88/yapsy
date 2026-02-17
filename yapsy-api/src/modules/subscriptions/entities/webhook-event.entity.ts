import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('webhook_events')
export class WebhookEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  source: string;

  @Column()
  event_type: string;

  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  @Column({ default: false })
  processed: boolean;

  @Column({ nullable: true, type: 'text' })
  error: string;

  @Column({ nullable: true })
  razorpay_event_id: string;

  @CreateDateColumn({ name: 'received_at' })
  received_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  processed_at: Date;
}
