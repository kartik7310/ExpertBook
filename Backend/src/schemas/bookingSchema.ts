import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    expertId: z.string({ message: 'Expert ID is required' }),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    timeSlot: z.string().regex(/^\d{2}:\d{2}$/, 'Time slot must be in HH:mm format'),
    notes: z.string().optional(),
  }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED']),
  }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];
