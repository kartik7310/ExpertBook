import React, { useEffect, useState } from 'react';
import { Search, Filter, Loader2 } from 'lucide-react';
import { expertService } from '../services/api';
import type { Expert } from '../types';
import ExpertCard from '../components/ExpertCard';

const categories = ['All', 'Technology', 'Finance', 'Marketing', 'Healthcare', 'Legal'];

const ExpertListing: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExperts = async () => {
    setLoading(true);
    try {
      const params = {
        name: search,
        category: category === 'All' ? undefined : category,
        page,
        limit: 8,
      };
      const response = await expertService.getExperts(params);
      setExperts(response.data.experts);
      setTotalPages(response.data.pages);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch experts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExperts();
    }, 500); // Debounce search

    return () => clearTimeout(timer);
  }, [search, category, page]);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-6 md:p-12 text-white">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">Find Your Expert</h1>
        <p className="text-primary-100 text-sm md:text-lg max-w-2xl">
          Book a session with top industry professionals and get the guidance you need to succeed.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <input
            type="text"
            placeholder="Search experts..."
            className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 outline-none text-sm md:text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${category === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-400'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
          <p className="text-gray-500">Loading amazing experts...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl text-center border border-red-100">
          <p className="font-semibold">{error}</p>
          <button onClick={fetchExperts} className="mt-4 text-sm underline">Try again</button>
        </div>
      ) : experts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">No experts found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-lg font-semibold transition-colors ${page === p
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-400'
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpertListing;
