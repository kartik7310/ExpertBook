import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Loader2, Star, Award, MapPin, CheckCircle2 } from 'lucide-react';
import { expertService } from '../services/api';
import type { Expert } from '../types';
import { io } from 'socket.io-client';
import BookingForm from '../components/BookingForm';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

const ExpertDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const fetchExpert = async () => {
    if (!id) return;
    try {
      const response = await expertService.getExpert(id);
      setExpert(response.data.data);
      // Default to first available date
      if (response.data.data.availableSlots.length > 0) {
        setSelectedDate(response.data.data.availableSlots[0].date);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load expert details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpert();

    // Real-time slot updates
    socket.on('slotBooked', (data: { expertId: string; date: string; timeSlot: string }) => {
      if (data.expertId === id) {
        setExpert(prev => {
          if (!prev) return null;
          return {
            ...prev,
            availableSlots: prev.availableSlots.map(s => {
              if (s.date === data.date) {
                return {
                  ...s,
                  slots: s.slots.filter(t => t !== data.timeSlot)
                };
              }
              return s;
            })
          };
        });
        
        // If the user had this slot selected, clear it
        if (selectedDate === data.date && selectedSlot === data.timeSlot) {
          setSelectedSlot(null);
          alert('Sorry, this slot was just booked by another user.');
        }
      }
    });

    return () => {
      socket.off('slotBooked');
    };
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
    </div>
  );

  if (error || !expert) return (
    <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center">
      {error || 'Expert not found'}
    </div>
  );

  const activeDaySlots = expert.availableSlots.find(s => s.date === selectedDate)?.slots || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0 shadow-inner">
          <img src={expert.profilePic} alt={expert.name} className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-grow space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{expert.name}</h1>
              <p className="text-primary-600 font-semibold">{expert.category}</p>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl border border-yellow-100">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{expert.rating} Rating</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              {expert.experience} Years Experience
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Remote / Video Call
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Verified Expert
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            {expert.about}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Date Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Select Date
          </h2>
          <div className="flex flex-col gap-2">
            {expert.availableSlots.map((day) => (
              <button
                key={day.date}
                onClick={() => { setSelectedDate(day.date); setSelectedSlot(null); }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedDate === day.date
                    ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-100'
                    : 'border-gray-100 hover:border-primary-300 bg-white'
                }`}
              >
                <div className="font-bold">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
                <div className="text-xs text-gray-500">{day.slots.length} slots available</div>
              </button>
            ))}
          </div>
        </div>

        {/* Slot Selection */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            Available Time Slots
          </h2>
          
          {selectedDate ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              {activeDaySlots.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {activeDaySlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 px-4 rounded-xl font-semibold border transition-all ${
                        selectedSlot === slot
                          ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No slots available for this date.
                </div>
              )}

              {selectedSlot && (
                <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <div className="text-sm text-gray-500">Selected Session</div>
                    <div className="text-lg font-bold">
                      {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {selectedSlot}
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowBookingForm(true)}
                    className="w-full md:w-auto px-10 py-4 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
                  >
                    Confirm & Book Now
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-3xl p-12 text-center text-gray-400 border-2 border-dashed border-gray-200">
              Please select a date to see available slots
            </div>
          )}
        </div>
      </div>

      {showBookingForm && expert && selectedDate && selectedSlot && (
        <BookingForm 
          expert={expert}
          date={selectedDate}
          slot={selectedSlot}
          onClose={() => setShowBookingForm(false)}
          onSuccess={() => {
            setShowBookingForm(false);
            // navigate('/my-bookings');
          }}
        />
      )}
    </div>
  );
};

export default ExpertDetail;
