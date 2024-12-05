import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types';
import { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
  role: UserRole | UserRole[];
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, loading, initialized, initialize } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      initialize();
    }
  }, [initialized, initialize]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const roles = Array.isArray(role) ? role : [role];
  if (!roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}