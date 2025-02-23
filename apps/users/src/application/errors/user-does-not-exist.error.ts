export class UserDoesNotExistError extends Error {
  constructor(email: string) {
    super(`User with email ${email} does not exist`);
    this.name = 'UserDoesNotExistError';
  }
}
