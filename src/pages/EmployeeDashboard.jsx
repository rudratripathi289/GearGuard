import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { equipmentService } from '../services/equipmentService';
import { useAuth } from '../hooks/useAuth';
import { KanbanStatus } from '../types';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import PriorityBadge from '../components/common/PriorityBadge';
import StatusBadge from '../components/common/StatusBadge';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRequests: 0,
    newRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
  });
  const [myEquipment, setMyEquipment] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [equipmentRes, requestsRes] = await Promise.all([
        equipmentService.getAll(user),
        requestService.getAll(user),
      ]);

      const equipment = equipmentRes.data;
      const requests = requestsRes.data;

      setMyEquipment(equipment);
      setMyRequests(requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

      setStats({
        totalRequests: requests.length,
        newRequests: requests.filter((r) => r.status === KanbanStatus.NEW).length,
        inProgressRequests: requests.filter((r) => 
          r.status === KanbanStatus.ASSIGNED || r.status === KanbanStatus.IN_PROGRESS
        ).length,
        completedRequests: requests.filter((r) => r.status === KanbanStatus.COMPLETED).length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Dashboard</h1>
        <p className="text-gray-600">View your equipment and maintenance requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalRequests}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Requests</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.newRequests}</p>
            </div>
            <div className="text-4xl">🆕</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.inProgressRequests}</p>
            </div>
            <div className="text-4xl">⚙️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedRequests}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Equipment</h2>
            <Link
              to="/equipment"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              View all →
            </Link>
          </div>

          {myEquipment.length === 0 ? (
            <EmptyState
              icon="🔧"
              title="No equipment assigned"
              message="You don't have any equipment assigned to you yet."
            />
          ) : (
            <div className="space-y-3">
              {myEquipment.slice(0, 5).map((eq) => (
                <Link
                  key={eq.id}
                  to={`/equipment/${eq.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{eq.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{eq.category} • {eq.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      eq.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {eq.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">My Requests</h2>
            <Link
              to="/requests/new"
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 font-medium"
            >
              + New Request
            </Link>
          </div>

          {myRequests.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No requests yet"
              message="Create your first maintenance request to get started."
              action={
                <Link
                  to="/requests/new"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Request
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {myRequests.slice(0, 5).map((request) => (
                <Link
                  key={request.id}
                  to={`/requests/${request.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {request.equipment?.name || 'Unknown Equipment'}
                    </h3>
                    <PriorityBadge priority={request.priority} />
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {request.issueDescription || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={request.status} />
                    <span className="text-xs text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">All My Requests</h2>
          <Link
            to="/requests"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        {myRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No requests found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Equipment
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Issue
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Priority
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {request.equipment?.name || 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      {request.issueDescription && request.issueDescription.length > 50
                        ? request.issueDescription.substring(0, 50) + '...'
                        : request.issueDescription || 'No description'}
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={request.priority} />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/requests/${request.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

