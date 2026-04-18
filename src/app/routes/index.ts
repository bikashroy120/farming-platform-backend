import express from 'express';
import { authRouter } from '../modules/auth/auth.route';

const router = express.Router();

const routes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/user',
    route: authRouter,
  },
];

routes.forEach(r => {
  router.use(r.path, r.route);
});

export default router;
