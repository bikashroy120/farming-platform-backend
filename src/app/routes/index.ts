import express from 'express';
import userRoute from '../modules/users/users.route';

const router = express.Router();

const routes = [
  {
    path: '/auth',
    route: userRoute,
  },
];

routes.forEach(r => {
  router.use(r.path, r.route);
});

export default router;
