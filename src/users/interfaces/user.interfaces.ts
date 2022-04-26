import { User } from '../entities/user.entity';

type UserNotPassword = Omit<User, 'password'>;

export interface FindAllUserResponse {
  paginate: {
    page: number;
    totalPages: number;
  };
  users: UserNotPassword[];
}
