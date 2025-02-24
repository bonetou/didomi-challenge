export class UserDoesNotExistError extends Error {
  constructor(identifier: string) {
    super(`User ${identifier} does not exist`);
    this.name = 'UserDoesNotExistError';
  }
}
