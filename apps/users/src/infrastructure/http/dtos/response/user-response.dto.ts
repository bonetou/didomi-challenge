import { ApiProperty } from '@nestjs/swagger';

export class ConsentResponseDto {
  @ApiProperty({
    example: 'email_notifications',
    description: 'The consent type',
  })
  id: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the consent is enabled',
  })
  enabled: boolean;

  constructor(id: string, enabled: boolean) {
    this.id = id;
    this.enabled = enabled;
  }
}

export class UserResponseDto {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({
    example: 'valid@email.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    type: [ConsentResponseDto],
    description: 'User consents',
  })
  consents: ConsentResponseDto[];

  constructor(
    id: string,
    email: string,
    consents: { id: string; enabled: boolean }[],
  ) {
    this.id = id;
    this.email = email;
    this.consents = consents.map(
      (consent) => new ConsentResponseDto(consent.id, consent.enabled),
    );
  }
}
