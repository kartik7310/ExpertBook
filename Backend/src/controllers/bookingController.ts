import { Request, Response, NextFunction } from 'express';
import bookingService from '../services/bookingService';
import AppError from '../utils/AppError';

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.createBooking(req.body);
    res.status(201).json({
      status: 'success',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.query;
    if (!email) {
      return next(new AppError('Email is required', 400));
    }

    const bookings = await bookingService.getBookingsByEmail(email as string);
    res.status(200).json({
      status: 'success',
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await bookingService.updateBookingStatus(id as string, status);
    res.status(200).json({
      status: 'success',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
