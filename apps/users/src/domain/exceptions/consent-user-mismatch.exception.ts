export class ConsentUserMismatchException extends Error {
  constructor(userId: string, consentUserId: string) {
    super(
      `Cannot apply a consent from user ${consentUserId} to user ${userId}`,
    );
    this.name = 'ConsentUserMismatchException';
  }
}
