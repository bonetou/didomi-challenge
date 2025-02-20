import { UserAggregate } from '../../domain/aggregates/user.aggregate';

export interface UserRepository {
  create: (user: UserAggregate) => Promise<void>;
  findByEmail: (email: string) => Promise<UserAggregate | null>;
  delete: (email: string) => Promise<void>;
}
