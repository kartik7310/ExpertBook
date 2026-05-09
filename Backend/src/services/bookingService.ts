import prisma from '../utils/prisma';
import AppError from '../utils/AppError';
import { io } from '../server';

class BookingService {

  async createBooking(data: any) {
    try {
      return await prisma.$transaction(async (tx: any) => {
        // 1. Check if slot is available
        const slot = await tx.slot.findFirst({
          where: {
            expertId: data.expertId,
            date: data.date,
            timeSlot: data.timeSlot,
            isAvailable: true,
          },
        });

        if (!slot) {
          throw new AppError('This time slot is no longer available', 400);
        }

        // 2. Mark slot as unavailable
        await tx.slot.update({
          where: { id: slot.id },
          data: { isAvailable: false },
        });
        const booking = await tx.booking.create({
          data: {
            expertId: data.expertId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            date: data.date,
            timeSlot: data.timeSlot,
            notes: data.notes,
            status: 'PENDING',
          },
          include: {
            expert: {
              select: { name: true, category: true }
            }
          }
        });

        // 4. Broadcast the update for real-time UI
        io.emit('slotBooked', {
          expertId: data.expertId,
          date: data.date,
          timeSlot: data.timeSlot
        });

        return booking;
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new AppError('This slot has already been booked by someone else', 400);
      }
      throw error;
    }
  }

  async getBookingsByEmail(email: string) {
    return await prisma.booking.findMany({
      where: { email },
      include: {
        expert: {
          select: { name: true, category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateBookingStatus(id: string, status: any) {
    try {
      return await prisma.booking.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      throw new AppError('Booking not found', 404);
    }
  }
}

export default new BookingService();
