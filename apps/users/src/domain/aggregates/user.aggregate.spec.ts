import { UserAggregate } from './user.aggregate';
import { User } from '../entities/user.entity';
import { Consent } from '../entities/consent.entity';
import { ConsentUserMismatchException } from '../exceptions/consent-user-mismatch.exception';

describe('UserAggregate', () => {
  let user: User;
  let userAggregate: UserAggregate;

  beforeEach(() => {
    user = new User('123', 'test@example.com');
    userAggregate = new UserAggregate(user);
  });

  it('should create a UserAggregate with no initial consents', () => {
    expect(userAggregate.getCurrentConsents()).toEqual([]);
  });

  it('should create a UserAggregate with initial consents', () => {
    const initialConsents = [
      new Consent('123', 'email_notifications', true),
      new Consent('123', 'sms_notifications', false),
    ];

    userAggregate = new UserAggregate(user, initialConsents);

    expect(userAggregate.getCurrentConsents()).toHaveLength(2);
    expect(userAggregate.getCurrentConsents()).toEqual(initialConsents);
  });

  it('should apply a new valid consent', () => {
    const consent = new Consent('123', 'email_notifications', true);

    userAggregate.applyNewConsent(consent);
    const consents = userAggregate.getCurrentConsents();

    expect(consents).toHaveLength(1);
    expect(consents[0]).toEqual(consent);
  });

  it('should overwrite an existing consent with a new state', () => {
    userAggregate.applyNewConsent(
      new Consent('123', 'email_notifications', true),
    );
    userAggregate.applyNewConsent(
      new Consent('123', 'email_notifications', false),
    );

    const consents = userAggregate.getCurrentConsents();
    expect(consents).toHaveLength(1);
    expect(consents[0]).toEqual(
      new Consent('123', 'email_notifications', false),
    );
  });

  it('should throw ConsentUserMismatchException when applying a consent from another user', () => {
    const consentFromAnotherUser = new Consent(
      '999',
      'email_notifications',
      true,
    );

    expect(() => userAggregate.applyNewConsent(consentFromAnotherUser)).toThrow(
      ConsentUserMismatchException,
    );
  });
});
