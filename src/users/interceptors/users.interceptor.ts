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
            const { avatarFileName } = user;
            user.password = undefined;
            user.avatarFileName = avatarFileName
              ? `${process.env.AVATAR_USER_HOST}/${avatarFileName}`
              : null;
          });
        }
        const { password } = data;
        if (password) {
          data.password = undefined;
        }
        const { avatarFileName } = data;
        if (avatarFileName) {
          data.avatarFileName = `${process.env.AVATAR_USER_HOST}/${avatarFileName}`;
        }
        return data;
      }),
    );
  }
}
