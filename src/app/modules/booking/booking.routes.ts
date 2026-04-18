import express from 'express';
import { BookingController } from './booking.controller';
import { authMiddlewares } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { createBookingZodSchema } from './booking.validation';

const router = express.Router();

router.post(
  '/create-booking',
  authMiddlewares.auth(),
  validateRequest(createBookingZodSchema),
  BookingController.createBooking,
);
router.get('/', authMiddlewares.auth(), BookingController.getAllBookings);

export const BookingRoutes = router;
