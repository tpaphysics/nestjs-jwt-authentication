import { User } from 'src/users/entities/user.entity';

export interface UserToken {
  user: User;
  access_token: string;
}
