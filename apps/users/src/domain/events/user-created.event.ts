export class UserCreatedEvent {
  constructor(
    public readonly userId: string,
    private readonly email: string,
  ) {}
}
