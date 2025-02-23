import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UserModel } from './user.model';

@Entity('consents')
export class ConsentModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  enabled: boolean;

  @ManyToOne(() => UserModel, (user) => user.consents)
  user: UserModel;
}
