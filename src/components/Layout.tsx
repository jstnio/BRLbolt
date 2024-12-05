import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

export default function Layout() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}