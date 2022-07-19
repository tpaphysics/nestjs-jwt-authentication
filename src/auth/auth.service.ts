import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedError } from './errors/unauthorized.error';

import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async login(user: User, configJwt?: any): Promise<UserToken> {
    const { id, email, name } = user;

    const payload: UserPayload = {
      sub: id,
      email: email,
      name: name,
    };

    return {
      user,
      access_token: this.jwtService.sign(payload, configJwt),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const { avatar } = user;
        return {
          ...user,
          avatar: avatar ? `${process.env.AVATAR_USER_HOST}/${avatar}` : null,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedError(
      'Email address or password provided is incorrect.',
    );
  }

  async forgot(email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid e-mail!');
    }
    const { access_token } = await this.login(user, {
      secret: process.env.JWT_SECRETE,
      expiresIn: process.env.JWT_FORGOT_EXPIRES_IN,
    });

    this.mailService.sendUserConfirmation(user, access_token);

    return {
      message: 'status ok!',
    };
  }
}
