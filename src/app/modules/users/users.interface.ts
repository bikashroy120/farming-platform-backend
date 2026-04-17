import { Role } from '../../../../generated/prisma/enums';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUserMeta {
  data: IUser[];
  meta: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface IUserFilter {
  searchTerm?: string;
  role?: string;
  status?: string;
}
