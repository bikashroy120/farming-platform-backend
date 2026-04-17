import express from 'express';
import { authMiddlewares } from '../../middlewares/auth';
import { userController } from './users.controller';

const route = express.Router();

route.get('/', authMiddlewares.auth('ADMIN'), userController.getUsers);
route.get('/:id', authMiddlewares.auth(), userController.getSingleUser);
route.patch(
  '/:id',
  authMiddlewares.auth('ADMIN'),
  userController.updateUserStatus,
);
route.delete('/:id', authMiddlewares.auth('ADMIN'), userController.deleteUser);

export const userRouter = route;
