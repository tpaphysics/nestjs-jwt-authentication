import { ApiProperty } from '@nestjs/swagger';
import { UserNotPassword } from './user-not-password.type';

export default class FindAllUserResponse {
  @ApiProperty({
    type: Object,
    example: {
      page: 1,
      totalPages: 2,
    },
  })
  paginate: {
    page: number;
    totalPages: number;
  };
  @ApiProperty({ type: () => [UserNotPassword] })
  users: UserNotPassword[];
}
