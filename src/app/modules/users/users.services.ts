import { Role } from '../../../../generated/prisma/enums';
import ApiError from '../../../error/ApiError';
import { prisma } from '../../../lib/prisma';
import { hashPassword } from '../../helpers/bcrypt';
import { IUser } from './users.interface';

const createUser = async (data: IUser) => {
  // Check if user already exists
  const exitsUser = await prisma.user.findUnique({
    where: { email: data.email },
    select: { id: true },
  });

  if (exitsUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  //  Hash the password
  const hash = await hashPassword(data.password);

  // Create the user
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hash,
      role: data.role as Role,
    },
  });
  // @ts-ignore
  delete user.password;
  return user;
};
