// use-cases.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from '../../infrastructure/database/models/user.model';
import { TypeOrmUserRepository } from '../../infrastructure/database/repositories/user.repository';
import { RabbitMQModule } from '../../infrastructure/messaging/rabbitmq.module';
import { RabbitMQEventBus } from '../../infrastructure/messaging/rabbitmq-event-bus';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { ConsentModel } from '../../infrastructure/database/models/consent.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, ConsentModel]),
    RabbitMQModule,
  ],
  providers: [
    CreateUserUseCase,

    {
      provide: 'USER_REPOSITORY',
      useClass: TypeOrmUserRepository,
    },
    {
      provide: 'EVENT_BUS',
      useClass: RabbitMQEventBus,
    },
  ],
  exports: [CreateUserUseCase],
})
export class UseCasesModule {}
