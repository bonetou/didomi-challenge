import { IsBoolean, IsEnum, IsUUID } from 'class-validator';

export enum ConsentId {
  EMAIL_NOTIFICATIONS = 'email_notifications',
  SMS_NOTIFICATIONS = 'sms_notifications',
}

export class ConsentChangedEventDto {
  @IsUUID()
  userId: string;

  @IsEnum(ConsentId)
  consentId: string;

  @IsBoolean()
  enabled: boolean;
}
