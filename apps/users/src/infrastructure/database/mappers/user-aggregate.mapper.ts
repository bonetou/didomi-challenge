import { UserAggregate } from '../../../domain/aggregates/user.aggregate';
import { UserModel } from '../models/user.model';
import { User } from '../../../domain/entities/user.entity';
import { Consent } from '../../../domain/entities/consent.entity';
import { ConsentModel } from '../models/consent.model';

export class UserAggregateMapper {
  static toDomain(model: UserModel): UserAggregate {
    const user = new User(model.id, model.email);
    const consents = model.consents.map(
      (c: ConsentModel) => new Consent(user.id, c.id, c.enabled),
    );
    return new UserAggregate(user, consents);
  }

  static toPersistence(userAggregate: UserAggregate): UserModel {
    return {
      id: userAggregate.user.id,
      email: userAggregate.user.email,
      consents: userAggregate.getCurrentConsents().map((c) => ({
        id: c.id,
        enabled: c.enabled,
        user: {
          id: userAggregate.user.id,
          email: userAggregate.user.email,
        } as UserModel,
      })),
    };
  }
}
