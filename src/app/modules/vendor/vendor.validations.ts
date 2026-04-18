import { z } from 'zod';
import { UserStatus } from '../../../../generated/prisma/enums';

export const updateUserSchema = z.object({
  body: z.object({
    status: z.nativeEnum(UserStatus),
  }),
});
