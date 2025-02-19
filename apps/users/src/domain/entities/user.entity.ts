import { InvalidEmailException } from '../exceptions/invalid-email.exception';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
  ) {
    if (!this.isValidEmail(email)) throw new InvalidEmailException(email);
  }

  private isValidEmail(email: string): boolean {
    return /\S+@\S+\.\S+/.test(email);
  }
}
