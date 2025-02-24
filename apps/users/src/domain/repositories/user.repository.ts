import { UserAggregate } from '../../domain/aggregates/user.aggregate';

export interface UserRepository {
  create: (user: UserAggregate) => Promise<void>;
  findByEmail: (email: string) => Promise<UserAggregate | null>;
  findById: (id: string) => Promise<UserAggregate | null>;
  update: (user: UserAggregate) => Promise<void>;
  delete: (email: string) => Promise<void>;
  exists: (email: string) => Promise<boolean>;
}
