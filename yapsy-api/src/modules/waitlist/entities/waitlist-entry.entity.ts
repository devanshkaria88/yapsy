import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('waitlist_entries')
export class WaitlistEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  utm_source: string;

  @Column({ nullable: true })
  utm_medium: string;

  @Column({ nullable: true })
  utm_campaign: string;

  @Column({ nullable: true })
  ip_address: string;

  @Column({ default: false })
  synced_to_resend: boolean;

  @CreateDateColumn()
  created_at: Date;
}
