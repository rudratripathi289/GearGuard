import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { requestService } from '../services/requestService';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { KanbanStatus, Priority } from '../types';
import { canChangeRequestStatus, canAssignTechnician, canAddComments, canViewRequest } from '../utils/permissions';
import { mockUsers } from '../services/mockData';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import PriorityBadge from '../components/common/PriorityBadge';
import StatusBadge from '../components/common/StatusBadge';

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin, isTechnician } = useAuth();
  const [request, setRequest] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requestRes, techniciansRes] = await Promise.all([
        requestService.getById(id),
        userService.getTechnicians(),
      ]);

      setRequest(requestRes.data);
      setTechnicians(techniciansRes.data);
      setSelectedTechnician(requestRes.data.assignedTechnicianId || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setSubmitting(true);
      await requestService.updateStatus(id, newStatus);
      setRequest((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignTechnician = async () => {
    if (!selectedTechnician) return;
    try {
      setSubmitting(true);
      await requestService.assignTechnician(id, selectedTechnician);
      await loadData();
    } catch (err) {
      alert('Failed to assign technician: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      setSubmitting(true);
      await requestService.addComment(id, {
        userId: user.id,
        userName: user.name,
        content: comment,
      });
      setComment('');
      await loadData();
    } catch (err) {
      alert('Failed to add comment: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isCompleted = request?.status === KanbanStatus.COMPLETED;
  const canEditStatus = canChangeRequestStatus(user?.role);
  const canEditAssignment = canAssignTechnician(user?.role);
  const canAddComment = canAddComments(user?.role, request, user?.id);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  if (!request) {
    return <ErrorState message="Request not found" />;
  }

  if (!canViewRequest(user?.role, request, user?.id)) {
    return <ErrorState message="You don't have permission to view this request" />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          to="/requests"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to Requests
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Maintenance Request Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Request Information</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Equipment:</span>
                <Link
                  to={`/equipment/${request.equipmentId}`}
                  className="block text-blue-600 hover:underline font-medium mt-1"
                >
                  {request.equipment?.name || 'Unknown'}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  {request.equipment?.location} • {request.equipment?.category}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Issue Description:</span>
                <p className="text-gray-800 mt-1 whitespace-pre-wrap">{request.issueDescription || 'No description provided'}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Priority:</span>
                  <div className="mt-1">
                    <PriorityBadge priority={request.priority} />
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <div className="mt-1">
                    <StatusBadge status={request.status} />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Request Date:</span>
                <p className="text-gray-800 mt-1">
                  {new Date(request.requestDate).toLocaleString()}
                </p>
              </div>

              {(() => {
                if (!request.createdByUserId) return null;
                const employee = mockUsers.find(u => u.id === request.createdByUserId);
                return employee ? (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Requested By:</span>
                    <p className="text-gray-800 mt-1">{employee.name}</p>
                    <p className="text-sm text-gray-600">{employee.email}</p>
                  </div>
                ) : null;
              })()}

              {request.assignedTechnician && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Assigned Technician:</span>
                  <p className="text-gray-800 mt-1">{request.assignedTechnician.name}</p>
                  <p className="text-sm text-gray-600">{request.assignedTechnician.email}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Activity Timeline</h2>
            <div className="space-y-4 mb-6">
              <div className="border-l-4 border-gray-300 pl-4 py-2">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-800">Request Created</span>
                  <span className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Status: <StatusBadge status={KanbanStatus.NEW} />
                </p>
                {(() => {
                  if (!request.createdByUserId) return null;
                  const employee = mockUsers.find(u => u.id === request.createdByUserId);
                  return employee ? (
                    <p className="text-sm text-gray-600 mt-1">Created by {employee.name}</p>
                  ) : null;
                })()}
              </div>

              {request.updatedAt !== request.createdAt && (
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-gray-800">Status Updated</span>
                    <span className="text-xs text-gray-500">
                      {new Date(request.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Current Status: <StatusBadge status={request.status} />
                  </p>
                </div>
              )}

              {request.comments && request.comments.length > 0 && (
                request.comments
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((comment, index) => (
                    <div key={comment.id} className="border-l-4 border-green-500 pl-4 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-gray-800">{comment.userName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))
              )}
            </div>

            {canAddComment && !isCompleted && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Comment</h3>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment or update..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <button
                  onClick={handleAddComment}
                  disabled={submitting || !comment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Comment'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {canEditAssignment && !isCompleted && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Assign Technician</h2>
              <select
                value={selectedTechnician}
                onChange={(e) => setSelectedTechnician(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              >
                <option value="">Select technician...</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAssignTechnician}
                disabled={submitting || !selectedTechnician}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          )}

          {canEditStatus && !isCompleted && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Status</h2>
              <div className="space-y-2">
                {request.status === KanbanStatus.NEW && (
                  <button
                    onClick={() => handleStatusChange(KanbanStatus.ASSIGNED)}
                    disabled={submitting}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                  >
                    Mark as Assigned
                  </button>
                )}
                {[KanbanStatus.ASSIGNED, KanbanStatus.NEW].includes(request.status) && (
                  <button
                    onClick={() => handleStatusChange(KanbanStatus.IN_PROGRESS)}
                    disabled={submitting}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                  >
                    Start Work
                  </button>
                )}
                {request.status === KanbanStatus.IN_PROGRESS && (
                  <button
                    onClick={() => handleStatusChange(KanbanStatus.UNDER_REVIEW)}
                    disabled={submitting}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    Mark for Review
                  </button>
                )}
                {request.status === KanbanStatus.UNDER_REVIEW && isAdmin() && (
                  <button
                    onClick={() => handleStatusChange(KanbanStatus.COMPLETED)}
                    disabled={submitting}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve & Complete
                  </button>
                )}
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="text-center">
                <div className="text-4xl mb-2">✅</div>
                <h3 className="font-semibold text-green-800 mb-2">Request Completed</h3>
                <p className="text-sm text-green-700">
                  This request has been completed and is now read-only.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

