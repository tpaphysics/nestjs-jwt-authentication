import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class SetThumbnailUrlAndDeletePasswordInterceptor
  implements NestInterceptor
{
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const { users } = data;
        if (users) {
          users.map((user) => {
            const { avatar } = user;
            user.password = undefined;
            user.avatar = avatar
              ? `${process.env.AVATAR_USER_HOST}/${avatar}`
              : null;
          });
        }
        const { password } = data;
        if (password) {
          data.password = undefined;
        }
        const { avatar } = data;
        if (avatar) {
          data.avatar = `${process.env.AVATAR_USER_HOST}/${avatar}`;
        }
        return data;
      }),
    );
  }
}
