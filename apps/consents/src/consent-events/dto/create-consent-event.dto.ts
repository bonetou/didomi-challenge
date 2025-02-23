import { IsBoolean, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConsentId } from '../enums/consent-ids.enum';

export class CreateConsentEventDto {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000000',
    description: 'User ID',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: 'email_notifications',
    enum: ConsentId,
  })
  @IsEnum(ConsentId)
  consentId: ConsentId;

  @ApiProperty({
    example: true,
    description: 'Whether the consent is enabled',
  })
  @IsBoolean()
  enabled: boolean;
}
