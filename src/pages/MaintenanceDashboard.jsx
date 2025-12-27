import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { equipmentService } from '../services/equipmentService';
import { mockUsers } from '../services/mockData';
import { KanbanStatus, Priority } from '../types';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import PriorityBadge from '../components/common/PriorityBadge';
import StatusBadge from '../components/common/StatusBadge';

export default function MaintenanceDashboard() {
  const [stats, setStats] = useState({
    totalOpenRequests: 0,
    requestsByPriority: {},
    requestsByStatus: {},
    totalEquipment: 0,
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

      const requestsByPriority = requests.reduce((acc, req) => {
        acc[req.priority] = (acc[req.priority] || 0) + 1;
        return acc;
      }, {});

      const requestsByStatus = requests.reduce((acc, req) => {
        acc[req.status] = (acc[req.status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalOpenRequests: requests.filter((r) => r.status !== KanbanStatus.COMPLETED).length,
        requestsByPriority,
        requestsByStatus,
        totalEquipment: equipment.length,
      });

      setRecentRequests(
        requests
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10)
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Maintenance Dashboard</h1>
        <p className="text-gray-600">Overview of all maintenance requests and equipment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Requests</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalOpenRequests}</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {(stats.requestsByPriority[Priority.HIGH] || 0) + (stats.requestsByPriority[Priority.CRITICAL] || 0)}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.requestsByStatus[KanbanStatus.IN_PROGRESS] || 0}
              </p>
            </div>
            <div className="text-4xl">⚙️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Equipment</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalEquipment}</p>
            </div>
            <div className="text-4xl">🔧</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Requests</h2>
            <div className="flex space-x-2">
              <Link
                to="/requests"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View all →
              </Link>
              <Link
                to="/kanban"
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Kanban →
              </Link>
            </div>
          </div>

          {recentRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No requests found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Employee
                    </th>
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
                      Assigned
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((request) => {
                    const employee = request.createdByUserId 
                      ? mockUsers.find(u => u.id === request.createdByUserId)
                      : null;
                    
                    return (
                    <tr
                      key={request.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-800">
                          {employee ? employee.name : 'Unknown'}
                        </span>
                      </td>
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
                          {request.issueDescription && request.issueDescription.length > 40
                            ? request.issueDescription.substring(0, 40) + '...'
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
                        {request.assignedTechnician?.name || 'Unassigned'}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/kanban"
              className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium"
            >
              View Kanban Board
            </Link>
            <Link
              to="/requests"
              className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-center font-medium"
            >
              All Requests
            </Link>
            <Link
              to="/equipment"
              className="block w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-center font-medium"
            >
              Equipment List
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Requests by Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">New</span>
                <span className="font-semibold">{stats.requestsByStatus[KanbanStatus.NEW] || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Assigned</span>
                <span className="font-semibold">{stats.requestsByStatus[KanbanStatus.ASSIGNED] || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">In Progress</span>
                <span className="font-semibold">{stats.requestsByStatus[KanbanStatus.IN_PROGRESS] || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Under Review</span>
                <span className="font-semibold">{stats.requestsByStatus[KanbanStatus.UNDER_REVIEW] || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold">{stats.requestsByStatus[KanbanStatus.COMPLETED] || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

