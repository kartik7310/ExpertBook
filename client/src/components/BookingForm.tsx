import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, CheckCircle, Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { bookingService } from '../services/api';
import type { Expert } from '../types';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  expert: Expert;
  date: string;
  slot: string;
  onClose: () => void;
  onSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ expert, date, slot, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    console.log('Submitting booking data:', data);
    setIsSubmitting(true);
    setError(null);
    try {
      await bookingService.createBooking({
        ...data,
        expertId: expert.id,
        date,
        timeSlot: slot,
      });
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to book session. The slot might have been taken.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="text-sm text-gray-500">Your session with {expert.name} has been successfully booked.</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-2xl text-left space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(date).toLocaleDateString('en-US', { dateStyle: 'full' })}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="w-3.5 h-3.5" />
              {slot}
            </div>
          </div>
          <p className="text-xs text-primary-600 animate-pulse font-medium">Redirecting you shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 duration-300 my-auto">
        {/* Left Side: Summary */}
        <div className="bg-primary-600 p-6 text-white md:w-64 shrink-0">
          <div className="flex justify-between items-center md:block mb-6">
            <h2 className="text-xl font-bold">Booking Summary</h2>
            <button onClick={onClose} className="md:hidden text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                <img src={expert.profilePic} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-[10px] text-primary-100 uppercase">Expert</div>
                <div className="font-bold text-sm">{expert.name}</div>
              </div>
            </div>
            
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div>
                <div className="text-[10px] text-primary-100 uppercase tracking-wider">Date</div>
                <div className="font-semibold text-sm">{new Date(date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-[10px] text-primary-100 uppercase tracking-wider">Time</div>
                <div className="font-semibold text-sm">{slot}</div>
              </div>
              <div>
                <div className="text-[10px] text-primary-100 uppercase tracking-wider">Type</div>
                <div className="font-semibold text-sm">Consultation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-6 flex-grow relative">
          <button 
            onClick={onClose} 
            className="hidden md:flex absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Information</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs border border-red-100 flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    {...register('name')}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none transition-all ${
                      errors.name ? 'border-red-300 ring-red-50' : 'border-gray-200 focus:ring-2 focus:ring-primary-50'
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  {...register('email')}
                  className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${
                    errors.email ? 'border-red-300 ring-red-50' : 'border-gray-200 focus:ring-2 focus:ring-primary-50'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                {...register('phone')}
                className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-all ${
                  errors.phone ? 'border-red-300 ring-red-50' : 'border-gray-200 focus:ring-2 focus:ring-primary-50'
                }`}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <p className="text-red-500 text-[10px] mt-0.5">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                {...register('notes')}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border text-sm border-gray-200 outline-none focus:ring-2 focus:ring-primary-50 transition-all resize-none"
                placeholder="Anything you'd like to share..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-200 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
