import { Consent } from '../entities/consent.entity';
import { User } from '../entities/user.entity';
import { ConsentUserMismatchException } from '../exceptions/consent-user-mismatch.exception';

export class UserAggregate {
  private latestConsents: Map<string, Consent>;

  constructor(
    public readonly user: User,
    consents: Consent[] = [],
  ) {
    this.latestConsents = new Map();
    consents.forEach((consent) => this.latestConsents.set(consent.id, consent));
  }

  getCurrentConsents(): Consent[] {
    return Array.from(this.latestConsents.values());
  }

  applyNewConsent(consent: Consent): void {
    if (consent.userId !== this.user.id) {
      throw new ConsentUserMismatchException(this.user.id, consent.userId);
    }
    this.latestConsents.set(consent.id, consent);
  }
}
