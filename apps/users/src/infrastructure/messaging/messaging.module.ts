import { Module } from '@nestjs/common';
import { UseCasesModule } from '../../application/use-cases/use-case.module';
import { ConsentEventsListener } from '../messaging/consent-events.listener';

@Module({
  imports: [UseCasesModule],
  controllers: [ConsentEventsListener],
})
export class MessagingModule {}
