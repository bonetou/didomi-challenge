import { UserFactory } from './user.factory';
import { UserAggregate } from '../aggregates/user.aggregate';
import { User } from '../entities/user.entity';
import { randomUUID } from 'crypto';

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('UserFactory', () => {
  describe('create', () => {
    it('should create a UserAggregate with a User entity', () => {
      const mockUUID = '00000000-0000-0000-0000-000000000000';
      const email = 'test@example.com';
      (randomUUID as jest.Mock).mockReturnValue(mockUUID);

      const userAggregate = UserFactory.create(email);

      expect(userAggregate).toBeInstanceOf(UserAggregate);
      expect(userAggregate.user).toBeInstanceOf(User);
      expect(userAggregate.user.id).toBe(mockUUID);
      expect(userAggregate.user.email).toBe(email);
    });
  });
});
