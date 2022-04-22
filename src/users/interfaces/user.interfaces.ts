import { User } from '../entities/user.entity';

export interface FindAllUserResponse {
  paginate: {
    page: number;
    totalPages: number;
  };
  users: User[];
}
