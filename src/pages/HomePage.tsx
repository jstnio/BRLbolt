import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// High-quality logistics images from Unsplash
const HERO_IMAGE = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070";
const CONTAINER_IMAGE = "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=1080";
const WAREHOUSE_IMAGE = "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1080";

export default function HomePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'manager') {
      navigate('/manager');
    } else if (user?.role === 'customer') {
      navigate('/customer');
    }
  }, [user, navigate]);

  // If user is authenticated, don't render the homepage content
  if (user) return null;

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleTrackShipment = () => {
    navigate('/login');
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleContactSales = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Global Logistics"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl font-display font-bold text-white tracking-tight sm:text-6xl">
              Global Logistics Solutions for Modern Business
            </h1>
            <p className="mt-6 text-xl text-gray-100 max-w-2xl">
              Streamline your international shipping with our comprehensive freight forwarding platform. From ocean freight to air cargo, we handle it all.
            </p>
            <div className="mt-10 flex gap-4">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={handleTrackShipment}
                className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                Track Shipment
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mt-3 max-w-lg text-lg text-primary-100">
                  Join thousands of businesses that trust BRL Global Logistics for their shipping needs.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="flex space-x-4">
                  <button
                    onClick={handleCreateAccount}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 transition-all duration-200"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={handleContactSales}
                    className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-primary-600 transition-all duration-200"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}