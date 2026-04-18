import express from 'express';
import { RentalSpaceController } from './rentalSpace.controller';
import { RentalSpaceValidation } from './rentalSpace.validation';
import validateRequest from '../../middlewares/validateRequest';
import { authMiddlewares } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  authMiddlewares.auth(),
  validateRequest(RentalSpaceValidation.createRentalSpaceZodSchema),
  RentalSpaceController.createRentalSpace,
);

router.get('/', RentalSpaceController.getAllRentalSpaces);
router.get('/:id', RentalSpaceController.getSingleRentalSpace);

router.patch(
  '/:id',
  authMiddlewares.auth(),
  validateRequest(RentalSpaceValidation.updateRentalSpaceZodSchema),
  RentalSpaceController.updateRentalSpace,
);

router.delete(
  '/:id',
  authMiddlewares.auth(),
  RentalSpaceController.deleteRentalSpace,
);

export const rentalSpaceRoutes = router;
