export interface Expert {
  id: string;
  name: string;
  category: string;
  experience: number;
  rating: number;
  profilePic: string;
  about: string;
  availableSlots: {
    date: string;
    slots: string[];
  }[];
}

export interface Booking {
  _id: string;
  expertId: string | Expert;
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
  experts?: T;
  total?: number;
  page?: number;
  pages?: number;
}
