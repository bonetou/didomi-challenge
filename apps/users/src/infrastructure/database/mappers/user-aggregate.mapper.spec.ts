import { UserAggregateMapper } from './user-aggregate.mapper';
import { UserAggregate } from '../../../domain/aggregates/user.aggregate';
import { UserModel } from '../models/user.model';
import { User } from '../../../domain/entities/user.entity';
import { Consent } from '../../../domain/entities/consent.entity';
import { ConsentModel } from '../models/consent.model';

describe('UserAggregateMapper', () => {
  describe('toDomain', () => {
    it('should map UserModel to UserAggregate', () => {
      const mockUserModel: UserModel = {
        id: '123',
        email: 'test@example.com',
        consents: [
          { id: 'consent-1', userId: '123', enabled: true } as ConsentModel,
          { id: 'consent-2', userId: '123', enabled: false } as ConsentModel,
        ],
        createdAt: new Date(),
      };

      const userAggregate = UserAggregateMapper.toDomain(mockUserModel);

      expect(userAggregate.user.id).toBe(mockUserModel.id);
      expect(userAggregate.user.email).toBe(mockUserModel.email);
      expect(userAggregate.getCurrentConsents()).toHaveLength(2);
      expect(userAggregate.getCurrentConsents()).toEqual([
        new Consent(mockUserModel.id, 'consent-1', true),
        new Consent(mockUserModel.id, 'consent-2', false),
      ]);
    });
  });

  describe('toPersistence', () => {
    it('should map UserAggregate to UserModel', () => {
      const mockUser = new User('123', 'test@example.com');
      const mockConsents = [
        new Consent('123', 'consent-1', true),
        new Consent('123', 'consent-2', false),
      ];
      const mockUserAggregate = new UserAggregate(mockUser, mockConsents);

      jest
        .spyOn(mockUserAggregate, 'getCurrentConsents')
        .mockReturnValue(mockConsents);

      const userModel = UserAggregateMapper.toPersistence(mockUserAggregate);

      expect(userModel.id).toBe(mockUserAggregate.user.id);
      expect(userModel.email).toBe(mockUserAggregate.user.email);
      expect(userModel.consents).toHaveLength(2);
      expect(userModel.consents[0]).toEqual({
        id: 'consent-1',
        userId: '123',
        enabled: true,
        user: { id: '123', email: 'test@example.com' },
      });
      expect(userModel.consents[1]).toEqual({
        id: 'consent-2',
        userId: '123',
        enabled: false,
        user: { id: '123', email: 'test@example.com' },
      });
    });
  });
});
