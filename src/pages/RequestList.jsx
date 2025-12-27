import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import PriorityBadge from '../components/common/PriorityBadge';
import StatusBadge from '../components/common/StatusBadge';

export default function RequestList() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      loadRequests();
    }
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getAll(user);
      setRequests(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadRequests} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Maintenance Requests</h1>
          <p className="text-gray-600">View and manage all maintenance requests</p>
        </div>
        <Link
          to="/requests/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          + New Request
        </Link>
      </div>

      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('new')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'new'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          New
        </button>
        <button
          onClick={() => setFilter('in-progress')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'in-progress'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No requests found"
          message={
            filter === 'all'
              ? 'Get started by creating your first maintenance request.'
              : `No requests with status "${filter}".`
          }
          action={
            filter === 'all' && (
              <Link
                to="/requests/new"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Request
              </Link>
            )
          }
        />
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
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
                    Assigned To
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
                {filteredRequests.map((request) => (
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
                      {request.assignedTechnician?.name || 'Unassigned'}
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
        </div>
      )}
    </div>
  );
}

