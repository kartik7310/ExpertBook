import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, CheckCircle2, AlertCircle, Clock3, Loader2 } from 'lucide-react';
import { bookingService } from '../services/api';
import type { Booking } from '../types';

const statusStyles = {
  Pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  Confirmed: 'bg-green-50 text-green-700 border-green-100',
  Completed: 'bg-blue-50 text-blue-700 border-blue-100',
};

const statusIcons = {
  Pending: <Clock3 className="w-4 h-4" />,
  Confirmed: <CheckCircle2 className="w-4 h-4" />,
  Completed: <CheckCircle2 className="w-4 h-4" />,
};

const MyBookings: React.FC = () => {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchBookings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await bookingService.getMyBookings(email);
      setBookings(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-500">Enter your email to view and manage your expert sessions.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={fetchBookings} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Enter your booking email..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 outline-none focus:ring-4 focus:ring-primary-50 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-100 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          View Bookings
        </button>
      </form>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 text-center flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10" />
          <p className="font-semibold">{error}</p>
        </div>
      ) : hasSearched && bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No Bookings Found</h3>
          <p className="text-gray-500 mt-2">We couldn't find any sessions associated with {email}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900">
                    Session with {(booking.expertId as any).name}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {booking.timeSlot}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                <div className={`px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2 ${statusStyles[booking.status]}`}>
                  {statusIcons[booking.status]}
                  {booking.status}
                </div>
                {/* Could add "Cancel" or "Reschedule" here */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
