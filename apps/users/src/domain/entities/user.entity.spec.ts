import { User } from './user.entity';
import { InvalidEmailException } from '../exceptions/invalid-email.exception';

describe('User Entity', () => {
  it('should create a user with valid email', () => {
    const user = new User('1', 'test@example.com');
    expect(user.id).toBe('1');
    expect(user.email).toBe('test@example.com');
  });

  it('should throw InvalidEmailException for invalid email', () => {
    expect(() => new User('1', 'invalid-email')).toThrow(InvalidEmailException);
  });

  it('should throw InvalidEmailException with the invalid email in the message', () => {
    try {
      new User('1', 'invalid-email');
    } catch (e) {
      const error = e as Error;
      expect(error).toBeInstanceOf(InvalidEmailException);
      expect(error.message).toBe('Invalid email address: invalid-email');
    }
  });
});
