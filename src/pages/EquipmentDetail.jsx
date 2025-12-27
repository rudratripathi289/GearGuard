import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { equipmentService } from '../services/equipmentService';
import { requestService } from '../services/requestService';
import { useAuth } from '../hooks/useAuth';
import { canViewEquipment } from '../utils/permissions';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import PriorityBadge from '../components/common/PriorityBadge';
import StatusBadge from '../components/common/StatusBadge';
import { EquipmentStatus } from '../types';

export default function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipment, setEquipment] = useState(null);
  const [relatedRequests, setRelatedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [id, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [equipmentRes, requestsRes] = await Promise.all([
        equipmentService.getById(id),
        requestService.getAll(user),
      ]);

      setEquipment(equipmentRes.data);
      setRelatedRequests(
        requestsRes.data.filter((req) => req.equipmentId === id)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = () => {
    navigate(`/requests/new?equipmentId=${id}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (!equipment) {
    return <ErrorState message="Equipment not found" />;
  }

  if (!canViewEquipment(user?.role, equipment, user?.id)) {
    return <ErrorState message="You don't have permission to view this equipment" />;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case EquipmentStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case EquipmentStatus.UNDER_MAINTENANCE:
        return 'bg-yellow-100 text-yellow-800';
      case EquipmentStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/equipment"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Equipment
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{equipment.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Details</h2>
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-600">Category:</span>
              <p className="text-gray-800 mt-1">{equipment.category}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Location:</span>
              <p className="text-gray-800 mt-1">{equipment.location}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <div className="mt-1">
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded ${getStatusColor(
                    equipment.status
                  )}`}
                >
                  {equipment.status.replace('-', ' ')}
                </span>
              </div>
            </div>
            {equipment.description && (
              <div>
                <span className="text-sm font-medium text-gray-600">Description:</span>
                <p className="text-gray-800 mt-1">{equipment.description}</p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-600">Created:</span>
              <p className="text-gray-800 mt-1">
                {new Date(equipment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <button
            onClick={handleCreateRequest}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium mb-3"
          >
            Create Maintenance Request
          </button>
          <Link
            to="/kanban"
            className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
          >
            View Kanban Board
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Maintenance Requests ({relatedRequests.length})
          </h2>
        </div>

        {relatedRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No maintenance requests for this equipment yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
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
                {relatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
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
        )}
      </div>
    </div>
  );
}

