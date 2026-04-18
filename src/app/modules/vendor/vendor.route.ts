import express from 'express';
import { authMiddlewares } from '../../middlewares/auth';
import { vendorController } from './vendor.controller';

const route = express.Router();

route.post(
  '/create',
  authMiddlewares.auth('VENDOR'),
  vendorController.createVendor,
);
route.get(
  '/vendor/all',
  authMiddlewares.auth('ADMIN'),
  vendorController.getVendors,
);
route.get('/:id', authMiddlewares.auth(), vendorController.getSingleVendor);
route.patch('/:id', authMiddlewares.auth('ADMIN'), vendorController.getVendors);
route.delete(
  '/:id',
  authMiddlewares.auth('ADMIN'),
  vendorController.deleteVendor,
);

export const vendorRoute = route;
