import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

type UserNotPassword = Omit<User, 'password'>;

export default class FindAllUserResponse {
  @ApiProperty({
    type: Object,
    default: {
      page: 1,
      totalPages: 2,
    },
  })
  paginate: {
    page: number;
    totalPages: number;
  };
  @ApiProperty({ type: () => [User] })
  users: UserNotPassword[];
}
