import express from 'express';
import { ProduceController } from './produce.controller';
import { ProduceValidation } from './produce.validation';
import validateRequest from '../../middlewares/validateRequest';
import { authMiddlewares } from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/',
  authMiddlewares.auth(),
  validateRequest(ProduceValidation.createProduceZodSchema),
  ProduceController.createProduce,
);

router.get('/', ProduceController.getAllProduce);

router.get('/:id', ProduceController.getSingleProduce);

router.patch(
  '/:id',
  authMiddlewares.auth(),
  validateRequest(ProduceValidation.updateProduceZodSchema),
  ProduceController.updateProduce,
);

router.delete('/:id', authMiddlewares.auth(), ProduceController.deleteProduce);

export const ProduceRoutes = router;
