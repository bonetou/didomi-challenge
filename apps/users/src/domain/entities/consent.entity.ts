export class Consent {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly enabled: boolean,
  ) {}
}
