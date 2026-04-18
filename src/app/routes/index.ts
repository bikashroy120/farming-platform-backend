import express from 'express';
import { authRouter } from '../modules/auth/auth.route';
import { authSwagger } from '../modules/auth/auth.swagger';
import { userSwagger } from '../modules/users/users.swagger';
import { userRouter } from '../modules/users/users.route';
import { vendorSwagger } from '../modules/vendor/vendor.swagger';
import { produceSwagger } from '../modules/produce/produce.swagger';
import { rentalSpaceSwagger } from '../modules/rentalSpace/rentalSpace.swagger';
import { orderSwagger } from '../modules/order/order.swagger';
import { bookingSwagger } from '../modules/booking/booking.swagger';
import { certificationSwagger } from '../modules/certification/certification.swagger';
import { plantSwagger } from '../modules/plant/plant.swagger';
import { vendorRoute } from '../modules/vendor/vendor.route';
import { certificationRoutes } from '../modules/certification/certification.routes';
import { produceRoutes } from '../modules/produce/produce.routes';
import { rentalSpaceRoutes } from '../modules/rentalSpace/rentalSpace.routes';
import { orderRoutes } from '../modules/order/order.routes';
import { bookingRoutes } from '../modules/booking/booking.routes';
import { plantRoutes } from '../modules/plant/plant.routes';

const router = express.Router();

export const setupSwaggerDocs = () => {
  authSwagger();
  userSwagger();
  vendorSwagger();
  certificationSwagger();
  produceSwagger();
  rentalSpaceSwagger();
  orderSwagger();
  bookingSwagger();
  plantSwagger();
};

const routes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/vendors',
    route: vendorRoute,
  },
  {
    path: '/certifications',
    route: certificationRoutes,
  },
  {
    path: '/produce',
    route: produceRoutes,
  },
  {
    path: '/rental-spaces',
    route: rentalSpaceRoutes,
  },
  {
    path: '/orders',
    route: orderRoutes,
  },
  {
    path: '/bookings',
    route: bookingRoutes,
  },
  {
    path: '/bookings',
    route: bookingRoutes,
  },
  {
    path: '/plants',
    route: plantRoutes,
  },
];

routes.forEach(r => {
  router.use(r.path, r.route);
});

export default router;
