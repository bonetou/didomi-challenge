import { Inject, Injectable } from '@nestjs/common';
import { UserAggregate } from '../../domain/aggregates/user.aggregate';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UseCase } from './use-case.interface';
import { UserDoesNotExistError } from '../errors/user-does-not-exist.error';

@Injectable()
export class GetUserUseCase implements UseCase<string, UserAggregate> {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<UserAggregate> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UserDoesNotExistError(email);
    }
    return user;
  }
}
