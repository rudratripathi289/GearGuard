import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { equipmentService } from '../services/equipmentService';
import { KanbanStatus } from '../types';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import StatusBadge from '../components/common/StatusBadge';
import PriorityBadge from '../components/common/PriorityBadge';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    activeRequests: 0,
    completedRequests: 0,
    requestsByStatus: {},
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [equipmentRes, requestsRes] = await Promise.all([
        equipmentService.getAll(),
        requestService.getAll(),
      ]);

      const equipment = equipmentRes.data;
      const requests = requestsRes.data;

      const requestsByStatus = requests.reduce((acc, req) => {
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalEquipment: equipment.length,
        activeRequests: requests.filter((r) => r.status !== KanbanStatus.COMPLETED).length,
        completedRequests: requests.filter((r) => r.status === KanbanStatus.COMPLETED).length,
        requestsByStatus,
      });

      setRecentRequests(
        requests
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      );
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your equipment and maintenance requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Equipment</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalEquipment}</p>
            </div>
            <div className="text-4xl">🔧</div>
          </div>
          <Link
            to="/equipment"
            className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Requests</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.activeRequests}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
          <Link
            to="/requests"
            className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.completedRequests}</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New Requests</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.requestsByStatus[KanbanStatus.NEW] || 0}
              </p>
            </div>
            <div className="text-4xl">🆕</div>
          </div>
          <Link
            to="/kanban"
            className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline"
          >
            View board →
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Requests</h2>
          <Link
            to="/requests"
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View all →
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No requests yet</p>
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
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <Link
                        to={`/equipment/${request.equipmentId}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {request.equipment?.name || 'Unknown'}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/requests/${request.id}`}
                        className="text-gray-800 hover:text-blue-600"
                      >
                        {request.issueDescription && request.issueDescription.length > 50
                          ? request.issueDescription.substring(0, 50) + '...'
                          : request.issueDescription || 'No description'}
                      </Link>
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

