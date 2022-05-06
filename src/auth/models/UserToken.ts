import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class UserToken {
  @ApiProperty()
  user: User;
  @ApiProperty({ default: 'jwt_token' })
  access_token: string;
}
