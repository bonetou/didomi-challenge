import { ConsentId } from '../enums/consent-ids.enum';

export interface ConsentCreatedEvent {
  userId: string;
  consentId: ConsentId;
  enabled: boolean;
}
