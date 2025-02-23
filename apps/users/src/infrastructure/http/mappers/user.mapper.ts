import { UserAggregate } from '../../../domain/aggregates/user.aggregate';
import { UserResponseDto } from '../dtos/response/user-response.dto';

export class UserDTOMapper {
  static toResponse(user: UserAggregate): UserResponseDto {
    return {
      id: user.user.id,
      email: user.user.email,
      consents: user.getCurrentConsents().map((c) => ({
        id: c.id,
        enabled: c.enabled,
      })),
    };
  }
}
