import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { ConcernLevel } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';

@Entity('journals')
@Unique(['user_id', 'date'])
export class Journal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ nullable: true })
  elevenlabs_conversation_id: string;

  @Column({ type: 'int', default: 0 })
  duration_seconds: number;

  @Column({ type: 'jsonb', default: [] })
  transcript: unknown[];

  @Column({ nullable: true, type: 'text' })
  summary: string;

  @Column({ nullable: true, type: 'int' })
  mood_score: number;

  @Column({ nullable: true })
  mood_label: string;

  @Column({ type: 'text', array: true, default: [] })
  themes: string[];

  @Column({ type: 'text', array: true, default: [] })
  wins: string[];

  @Column({ type: 'text', array: true, default: [] })
  struggles: string[];

  @Column({ type: 'text', array: true, default: [] })
  people_mentioned: string[];

  @Column({ type: 'enum', enum: ConcernLevel, default: ConcernLevel.LOW })
  concern_level: ConcernLevel;

  @Column({ type: 'jsonb', default: [] })
  actions_taken: unknown[];

  @Column({ default: 'pending' })
  processing_status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.journals)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
