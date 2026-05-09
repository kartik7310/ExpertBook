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
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="text-gray-500">Your session with {expert.name} has been successfully booked.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-2xl text-left space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {new Date(date).toLocaleDateString('en-US', { dateStyle: 'full' })}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              {slot}
            </div>
          </div>
          <p className="text-sm text-primary-600 animate-pulse font-medium">Redirecting you shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Left Side: Summary */}
        <div className="bg-primary-600 p-8 text-white md:w-72 shrink-0">
          <div className="flex justify-between items-center md:block mb-8">
            <h2 className="text-2xl font-bold">Booking Summary</h2>
            <button onClick={onClose} className="md:hidden text-white/80 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
                <img src={expert.profilePic} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs text-primary-100">Expert</div>
                <div className="font-bold">{expert.name}</div>
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <div className="text-xs text-primary-100 uppercase tracking-wider">Date</div>
                <div className="font-semibold">{new Date(date).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-xs text-primary-100 uppercase tracking-wider">Time</div>
                <div className="font-semibold">{slot}</div>
              </div>
              <div>
                <div className="text-xs text-primary-100 uppercase tracking-wider">Type</div>
                <div className="font-semibold">Professional Consultation</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 flex-grow relative">
          <button 
            onClick={onClose} 
            className="hidden md:flex absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h3>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            
            {Object.keys(errors).length > 0 && (
              <div className="bg-orange-50 text-orange-700 p-4 rounded-xl text-sm border border-orange-100">
                Please fix the errors in the form before submitting.
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  {...register('name')}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all ${
                    errors.name ? 'border-red-300 ring-red-50' : 'border-gray-200 focus:ring-4 focus:ring-primary-50'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                {...register('email')}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  errors.email ? 'border-red-300 ring-red-50' : 'border-gray-200 focus:ring-4 focus:ring-primary-50'
                }`}
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input
                {...register('phone')}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  errors.phone ? 'border-red-300 ring-red-50' : 'border-gray-200 focus:ring-4 focus:ring-primary-50'
                }`}
                placeholder="+1 (555) 000-0000"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-primary-50 transition-all resize-none"
                placeholder="Anything you'd like the expert to know..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
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
