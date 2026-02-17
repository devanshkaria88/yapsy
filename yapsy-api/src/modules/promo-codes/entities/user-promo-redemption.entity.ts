import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PromoCode } from './promo-code.entity';

@Entity('user_promo_redemptions')
@Unique(['user_id', 'promo_code_id'])
export class UserPromoRedemption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  promo_code_id: string;

  @Column({ type: 'timestamp' })
  redeemed_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  effective_until: Date;

  @ManyToOne(() => User, (user) => user.promo_redemptions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PromoCode, (promo_code) => promo_code.redemptions)
  @JoinColumn({ name: 'promo_code_id' })
  promo_code: PromoCode;
}
