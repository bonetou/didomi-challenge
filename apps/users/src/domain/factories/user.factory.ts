import { UserAggregate } from '../aggregates/user.aggregate';
import { User } from '../entities/user.entity';
import { randomUUID } from 'crypto';

export class UserFactory {
  static create(email: string): UserAggregate {
    const userEntity = new User(randomUUID().toString(), email);
    return new UserAggregate(userEntity);
  }
}
