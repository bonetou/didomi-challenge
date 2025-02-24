import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ConsentModel } from './consent.model';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => ConsentModel, (consent) => consent.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  consents: ConsentModel[];
}
