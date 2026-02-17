import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MoodTrend } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';

@Entity('mood_insights')
export class MoodInsight {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column({ type: 'date' })
  week_start: string;

  @Column({ nullable: true, type: 'float' })
  avg_mood: number;

  @Column({ nullable: true, type: 'enum', enum: MoodTrend })
  mood_trend: MoodTrend;

  @Column({ type: 'text', array: true, default: [] })
  top_themes: string[];

  @Column({ nullable: true, type: 'float' })
  productivity_score: number;

  @Column({ nullable: true, type: 'text' })
  insight_text: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
