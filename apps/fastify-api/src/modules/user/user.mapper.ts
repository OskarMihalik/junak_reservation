import { User } from './user.entity';

export function mapUserToDto(user: User) {
  return {
    id: user.id,
    name: user.name,
    surname: user.surname,
    aisId: user.aisId,
    email: user.email,
  };
}
