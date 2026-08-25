import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';

export default function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'FARMER') return <Navigate to="/farmer/dashboard" replace />;
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/buyer/dashboard" replace />;
  }

  return children;
}
