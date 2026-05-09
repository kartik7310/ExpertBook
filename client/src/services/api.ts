import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expertService = {
  getExperts: (params: any) => api.get('/experts', { params }),
  getExpert: (id: string) => api.get(`/experts/${id}`),
};

export const bookingService = {
  createBooking: (data: any) => api.post('/bookings', data),
  getMyBookings: (email: string) => api.get(`/bookings?email=${email}`),
  updateStatus: (id: string, status: string) => api.patch(`/bookings/${id}/status`, { status }),
};

export default api;
