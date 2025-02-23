export class UserDeletedEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
  ) {}
}
