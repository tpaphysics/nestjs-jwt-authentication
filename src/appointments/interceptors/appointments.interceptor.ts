import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Moment } from 'moment-timezone';

@Injectable()
export class FormatDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        /* const { users } = data;
        if (users) {
          users.map((user) => {
            const { avatar } = user;
            user.password = undefined;
            user.avatar = avatar
              ? `${process.env.AVATAR_USER_HOST}/${avatar}`
              : null;
          });
        }*/
        const { createdAt } = data;
        if (createdAt) {
          return data;
        }

        return data;
      }),
    );
  }
}
