import express from 'express';
import { CertificationController } from './certification.controller';
import { CertificationValidation } from './certification.validation';
import { authMiddlewares } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/',
  authMiddlewares.auth('VENDOR'),
  validateRequest(CertificationValidation.createCertificationZodSchema),
  CertificationController.createCertification,
);

router.get(
  '/vendor/:vendorId',
  CertificationController.getVendorCertifications,
);

router.patch(
  '/verify/:id',
  authMiddlewares.auth('ADMIN'),
  validateRequest(CertificationValidation.verifyCertificationZodSchema),
  CertificationController.verifyCertification,
);

export const certificationRoutes = router;
