import prisma from '../utils/prisma';

class ExpertService {
  async getAllExperts(query: { name?: string; category?: string; page?: number; limit?: number }) {
    const { name, category, page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }
    if (category) {
      where.category = category;
    }

    const [experts, total] = await Promise.all([
      prisma.expert.findMany({
        where,
        skip,
        take,
        include: {
          slots: {
            where: { isAvailable: true }
          }
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.expert.count({ where }),
    ]);

    // Format experts to group slots by date to match previous API response
    const formattedExperts = experts.map((expert: any) => {
      const groupedSlots: { [key: string]: string[] } = {};
      expert.slots.forEach((slot: any) => {
        if (!groupedSlots[slot.date]) {
          groupedSlots[slot.date] = [];
        }
        groupedSlots[slot.date].push(slot.timeSlot);
      });

      return {
        ...expert,
        availableSlots: Object.entries(groupedSlots).map(([date, slots]) => ({
          date,
          slots
        }))
      };
    });

    return {
      experts: formattedExperts,
      total,
      page: Number(page),
      pages: Math.ceil(total / take),
    };
  }

  async getExpertById(id: string) {
    const expert = await prisma.expert.findUnique({
      where: { id },
      include: {
        slots: {
          where: { isAvailable: true }
        }
      }
    });

    if (!expert) return null;

    // Format slots
    const groupedSlots: { [key: string]: string[] } = {};
    expert.slots.forEach((slot: any) => {
      if (!groupedSlots[slot.date]) {
        groupedSlots[slot.date] = [];
      }
      groupedSlots[slot.date].push(slot.timeSlot);
    });

    return {
      ...expert,
      availableSlots: Object.entries(groupedSlots).map(([date, slots]) => ({
        date,
        slots
      }))
    };
  }
}

export default new ExpertService();
