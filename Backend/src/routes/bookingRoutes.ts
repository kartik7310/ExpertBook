import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController';
import validate from '../middleware/validateRequest';
import { createBookingSchema, updateBookingStatusSchema } from '../schemas/bookingSchema';

const router = express.Router();

router.post('/', validate(createBookingSchema), createBooking);
router.get('/', getMyBookings);
router.patch('/:id/status', validate(updateBookingStatusSchema), updateBookingStatus);

export default router;
