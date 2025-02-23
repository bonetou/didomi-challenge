import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EventBus } from './event-bus.interface';

@Injectable()
export class RabbitMQEventBus implements EventBus {
  private readonly logger = new Logger(RabbitMQEventBus.name);

  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly rabbitClient: ClientProxy,
  ) {}

  publish(event: string, payload: any) {
    try {
      this.rabbitClient.emit(event, payload);
      this.logger.log(
        `Published event: ${event} with payload: ${JSON.stringify(payload)}`,
      );
    } catch (error) {
      this.logger.error(
        `Error publishing event ${event} with payload ${payload}. Error: ${JSON.stringify(error)}`,
      );
    }
  }
}
