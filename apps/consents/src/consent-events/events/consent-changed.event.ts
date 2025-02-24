import { ConsentId } from '../enums/consent-ids.enum';

export interface ConsentChangedEvent {
  userId: string;
  consentId: ConsentId;
  enabled: boolean;
}
