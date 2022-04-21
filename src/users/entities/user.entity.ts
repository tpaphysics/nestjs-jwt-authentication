import { Prisma } from '@prisma/client';

export class User implements Prisma.userUncheckedCreateInput {
  id?: string;
  email: string;
  name: string;
  avatarFileName?: string;
  createdAs?: string | Date;
  updateAs?: string | Date;
}
