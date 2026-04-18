import express from 'express';
import { PlantController } from './plant.controller';
import { PlantValidation } from './plant.validation';
import { authMiddlewares } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/',
  authMiddlewares.auth(),
  validateRequest(PlantValidation.createPlantZodSchema),
  PlantController.createPlant,
);

router.patch(
  '/:id/update-health',
  authMiddlewares.auth(),
  validateRequest(PlantValidation.updatePlantStatusZodSchema),
  PlantController.updatePlantStatus,
);

router.get('/:id', authMiddlewares.auth(), PlantController.getPlantDetails);

export const PlantRoutes = router;
