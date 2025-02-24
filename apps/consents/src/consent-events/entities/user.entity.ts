import {
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { ConsentEvent } from './consent-events.entity';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => ConsentEvent, (consent) => consent.user)
  consents: ConsentEvent[];
}
