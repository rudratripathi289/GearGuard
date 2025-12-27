import { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import { KanbanStatus } from '../../types';
import KanbanColumn from './KanbanColumn';
import Loading from '../common/Loading';
import ErrorState from '../common/ErrorState';

const COLUMN_STATUSES = [
  KanbanStatus.NEW,
  KanbanStatus.ASSIGNED,
  KanbanStatus.IN_PROGRESS,
  KanbanStatus.UNDER_REVIEW,
  KanbanStatus.COMPLETED,
];

export default function KanbanBoard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await requestService.getAll();
      setRequests(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = async (requestId, newStatus) => {
    try {
      await requestService.updateStatus(requestId, newStatus);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update request status. Please try again.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadRequests} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Kanban Board</h1>
        <p className="text-gray-600">Drag and drop requests to update their status</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMN_STATUSES.map((status) => {
          const columnRequests = requests.filter((req) => req.status === status);
          return (
            <KanbanColumn
              key={status}
              status={status}
              requests={columnRequests}
              onDrop={handleDrop}
            />
          );
        })}
      </div>
    </div>
  );
}

