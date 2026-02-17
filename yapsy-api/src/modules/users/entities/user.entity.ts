import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Gender, SubscriptionStatus } from '../../../common/enums';
import { Task } from '../../tasks/entities/task.entity';
import { Journal } from '../../journals/entities/journal.entity';
import { Note } from '../../notes/entities/note.entity';
import { UserPromoRedemption } from '../../promo-codes/entities/user-promo-redemption.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Firebase UID — the single source of identity */
  @Column({ unique: true })
  firebase_uid: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar_url: string;

  /** Auth provider used at sign-up: 'google' | 'apple' */
  @Column({ nullable: true })
  auth_provider: string;

  @Column({ default: 'Asia/Kolkata' })
  timezone: string;

  // --- Onboarding fields ---

  @Column({ default: false })
  is_onboarded: boolean;

  @Column({ nullable: true, type: 'date' })
  date_of_birth: string;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  // --- Subscription ---

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.FREE,
  })
  subscription_status: SubscriptionStatus;

  @Column({ nullable: true })
  razorpay_subscription_id: string;

  @Column({ nullable: true })
  razorpay_customer_id: string;

  // --- Streaks & check-ins ---

  @Column({ default: 0 })
  current_streak: number;

  @Column({ default: 0 })
  total_check_ins: number;

  @Column({ default: 0 })
  weekly_check_in_count: number;

  @Column({ nullable: true, type: 'date' })
  weekly_check_in_reset_date: string;

  @Column({ nullable: true, type: 'date' })
  last_check_in_date: string;

  // --- Push notifications ---

  @Column({ nullable: true })
  fcm_token: string;

  // --- Backend refresh token (our own JWT, not Firebase) ---

  @Column({ nullable: true })
  refresh_token_hash: string;

  // --- Timestamps ---

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // --- Relations ---

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @OneToMany(() => Journal, (journal) => journal.user)
  journals: Journal[];

  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  @OneToMany(() => UserPromoRedemption, (r) => r.user)
  promo_redemptions: UserPromoRedemption[];
}
