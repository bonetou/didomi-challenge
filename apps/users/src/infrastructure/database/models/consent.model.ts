import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { UserModel } from './user.model';

@Entity('consents')
@Unique(['id', 'user'])
export class ConsentModel {
  @PrimaryColumn()
  id: string;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column()
  enabled: boolean;

  @ManyToOne(() => UserModel, (user) => user.consents, { onDelete: 'CASCADE' })
  user: UserModel;
}
