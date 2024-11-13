import { User } from './user.entity';

export function mapUserToDto(user: User) {
  return {
    name: user.name,
    surname: user.surname,
    aisId: user.aisId,
    email: user.email,
  };
}
