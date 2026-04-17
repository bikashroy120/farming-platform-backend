import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { loginSchema, registerSchema } from './auth.validations';
import { authController } from './auth.controller';

const route = express.Router();

route.post(
  '/register',
  validateRequest(registerSchema),
  authController.register,
);
route.post('/login', validateRequest(loginSchema), authController.loginUser);
route.post('/logout', authController.logoutUser);
route.get('/access-token', authController.getAccessToken);
// route.get('/get-me',  authController.);

export const authRouter = route;
