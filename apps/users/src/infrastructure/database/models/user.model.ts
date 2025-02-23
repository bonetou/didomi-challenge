import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ConsentModel } from './consent.model';

@Entity('users')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => ConsentModel, (consent) => consent.user, { cascade: true })
  consents: ConsentModel[];
}
