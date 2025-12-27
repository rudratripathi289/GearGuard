import { useAuth } from '../../hooks/useAuth';
import EmployeeDashboard from '../../pages/EmployeeDashboard';
import MaintenanceDashboard from '../../pages/MaintenanceDashboard';
import { isEmployee } from '../../utils/permissions';

export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (isEmployee(user.role)) {
    return <EmployeeDashboard />;
  }

  return <MaintenanceDashboard />;
}

