import { z } from 'zod';
import { Role } from '../../../../generated/prisma/enums';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'name is required'),
    email: z.email().nonempty('email is requires'),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
    role: z.nativeEnum(Role).default(Role.CUSTOMER),
  }),
});
