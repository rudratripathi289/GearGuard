import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isMaintenanceTeam } from '../../utils/permissions';
import Loading from '../common/Loading';

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'maintenance' && !isMaintenanceTeam(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole && requiredRole !== 'maintenance' && user.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

