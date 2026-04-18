import express from 'express';
import { OrderController } from './order.controller';
import { OrderValidation } from './order.validation';
import validateRequest from '../../middlewares/validateRequest';
import { authMiddlewares } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  authMiddlewares.auth(),
  validateRequest(OrderValidation.createOrderZodSchema),
  OrderController.createOrder,
);

router.get('/my-orders', authMiddlewares.auth(), OrderController.getMyOrders);

router.get(
  '/vendor-dashboard',
  authMiddlewares.auth(),
  OrderController.getVendorOrders,
);

router.patch(
  '/:id/status',
  authMiddlewares.auth(),
  validateRequest(OrderValidation.updateOrderStatusZodSchema),
  OrderController.updateOrderStatus,
);

export const orderRoutes = router;
