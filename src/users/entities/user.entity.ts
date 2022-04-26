import { Prisma } from '@prisma/client';

export class User implements Prisma.userUncheckedCreateInput {
  id?: string;
  email: string;
  name: string;
  password: string;
  age: number;
  gender: string;
  avatarFileName?: string;
  createdAt?: string | Date;
  updateAt?: string | Date;
}
