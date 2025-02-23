import { Module } from '@nestjs/common';
import { ConsentsController as ConsentEventsController } from './consent-events.controller';
import { ConsentEventsService } from './consent-events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQEventBus, RabbitMQModule } from '@app/messaging';
import { ConsentEvent } from './entities/consent-events.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConsentEvent, User]), RabbitMQModule],
  controllers: [ConsentEventsController],
  providers: [
    {
      provide: 'EVENT_BUS',
      useClass: RabbitMQEventBus,
    },
    ConsentEventsService,
  ],
})
export class ConsentEventsModule {}
