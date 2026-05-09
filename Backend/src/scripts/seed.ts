import dotenv from 'dotenv';
import dns from 'node:dns';

dns.setServers(["8.8.8.8", "1.1.1.1"]);
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

import prisma from '../utils/prisma';

const experts = [
  {
    name: 'Dr. Sarah Johnson',
    category: 'Technology',
    experience: 12,
    rating: 4.8,
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    about: 'Expert in Cloud Architecture and AI integration with over 12 years of industry experience.',
    availableSlots: [
      {
        date: '2026-05-10',
        slots: ['09:00', '10:00', '11:00', '14:00', '15:00'],
      },
      {
        date: '2026-05-11',
        slots: ['09:00', '10:00', '16:00'],
      }
    ],
  },
  {
    name: 'Michael Chen',
    category: 'Finance',
    experience: 8,
    rating: 4.5,
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    about: 'Investment strategist and personal finance advisor helping people build long-term wealth.',
    availableSlots: [
      {
        date: '2026-05-10',
        slots: ['10:00', '11:00', '12:00'],
      },
      {
        date: '2026-05-12',
        slots: ['09:00', '13:00', '14:00', '15:00'],
      }
    ],
  },
  {
    name: 'Elena Rodriguez',
    category: 'Marketing',
    experience: 10,
    rating: 4.9,
    profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    about: 'Digital marketing maven specializing in brand growth and social media strategy.',
    availableSlots: [
      {
        date: '2026-05-11',
        slots: ['11:00', '12:00', '13:00'],
      }
    ],
  },
  {
    name: 'David Wilson',
    category: 'Technology',
    experience: 15,
    rating: 4.7,
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    about: 'Senior Full Stack Developer and open source contributor.',
    availableSlots: [
      {
        date: '2026-05-10',
        slots: ['09:00', '14:00'],
      }
    ],
  }
];

const seedDB = async () => {
  try {
    console.log('Cleaning up database...');
    await prisma.booking.deleteMany({});
    await prisma.slot.deleteMany({});
    await prisma.expert.deleteMany({});

    console.log('Seeding experts and slots...');
    for (const expertData of experts) {
      const { availableSlots, ...expertInfo } = expertData;
      
      const expert = await prisma.expert.create({
        data: expertInfo
      });

      for (const day of availableSlots) {
        await prisma.slot.createMany({
          data: day.slots.map(slotTime => ({
            expertId: expert.id,
            date: day.date,
            timeSlot: slotTime,
            isAvailable: true
          }))
        });
      }
    }

    console.log('Database seeded successfully! 🌱');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedDB();
