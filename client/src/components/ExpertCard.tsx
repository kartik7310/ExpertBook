import React from 'react';
import { Star, Briefcase, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Expert } from '../types';

interface ExpertCardProps {
  expert: Expert;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm card-hover flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={expert.profilePic || 'https://via.placeholder.com/400'} 
          alt={expert.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-sm font-semibold flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          {expert.rating}
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{expert.name}</h3>
          <p className="text-primary-600 font-medium text-sm uppercase tracking-wider">{expert.category}</p>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Briefcase className="w-4 h-4" />
          <span className="text-sm">{expert.experience} Years Experience</span>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow">
          {expert.about}
        </p>
        
        <Link 
          to={`/experts/${expert.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
        >
          View Profile
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ExpertCard;
