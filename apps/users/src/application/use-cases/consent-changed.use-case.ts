import { Inject, Injectable, Logger } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UseCase } from './use-case.interface';
import { ConsentChangedEventDto } from '../../infrastructure/messaging/dto/consent-changed-event.dto';
import { Consent } from '../../domain/entities/consent.entity';
import { UserDoesNotExistError } from '../errors/user-does-not-exist.error';

@Injectable()
export class ConsentChangedUseCase
  implements UseCase<ConsentChangedEventDto, void>
{
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
  ) {}
  private readonly logger = new Logger(ConsentChangedUseCase.name);

  async execute(consentChangedDto: ConsentChangedEventDto): Promise<void> {
    const user = await this.userRepository.findById(consentChangedDto.userId);

    if (!user) {
      throw new UserDoesNotExistError(consentChangedDto.userId);
    }

    user.applyNewConsent(
      new Consent(
        consentChangedDto.userId,
        consentChangedDto.consentId,
        consentChangedDto.enabled,
      ),
    );

    await this.userRepository.update(user);
  }
}
