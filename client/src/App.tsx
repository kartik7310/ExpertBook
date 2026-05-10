import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExpertListing from './pages/ExpertListing';
import ExpertDetail from './pages/ExpertDetail';
import MyBookings from './pages/MyBookings';

const Navbar = () => (
  <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
    <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4 md:px-6">
      <Link to="/" className="text-xl md:text-2xl font-bold text-primary-600 flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shrink-0">
          <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
        </div>
        <span className="hidden xs:inline">ExpertBook</span>
      </Link>
      <div className="flex gap-4 md:gap-8">
        <Link to="/" className="text-sm md:text-base text-gray-600 hover:text-primary-600 font-semibold transition-colors">Find Experts</Link>
        <Link to="/my-bookings" className="text-sm md:text-base text-gray-600 hover:text-primary-600 font-semibold transition-colors">My Bookings</Link>
      </div>
    </div>
  </nav>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
          <Routes>
            <Route path="/" element={<ExpertListing />} />
            <Route path="/experts/:id" element={<ExpertDetail />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-100 py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              &copy; 2026 ExpertBook. Empowering professional growth.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="https://github.com/kartik7310" className="hover:text-primary-600">Privacy Policy</Link>
              <Link to="https://github.com/kartik7310" className="hover:text-primary-600">Terms of Service</Link>
              <Link to="https://github.com/kartik7310" className="hover:text-primary-600">Contact Us</Link>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
