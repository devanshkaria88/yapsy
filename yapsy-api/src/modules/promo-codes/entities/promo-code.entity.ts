import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PromoType } from '../../../common/enums';
import { UserPromoRedemption } from './user-promo-redemption.entity';

@Entity('promo_codes')
export class PromoCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'enum', enum: PromoType })
  type: PromoType;

  @Column({ type: 'int' })
  value: number;

  @Column({ nullable: true, type: 'int' })
  duration_months: number;

  @Column({ nullable: true, type: 'int' })
  max_uses: number;

  @Column({ type: 'int', default: 0 })
  current_uses: number;

  @Column({ type: 'timestamp' })
  valid_from: Date;

  @Column({ nullable: true, type: 'timestamp' })
  valid_until: Date;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => UserPromoRedemption, (r) => r.promo_code)
  redemptions: UserPromoRedemption[];
}
