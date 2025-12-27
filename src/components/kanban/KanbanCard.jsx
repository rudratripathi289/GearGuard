import { Link } from 'react-router-dom';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';

export default function KanbanCard({ request }) {
  const truncatedDescription = request.issueDescription.length > 100
    ? request.issueDescription.substring(0, 100) + '...'
    : request.issueDescription;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('requestId', request.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="bg-white rounded-lg shadow-md p-4 mb-3 hover:shadow-lg transition-shadow border border-gray-200 cursor-move"
    >
      <Link to={`/requests/${request.id}`} className="block">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-800 text-sm">
            {request.equipment?.name || 'Unknown Equipment'}
          </h4>
          <PriorityBadge priority={request.priority} />
        </div>
        
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {truncatedDescription}
        </p>

        <div className="flex items-center justify-between">
          <StatusBadge status={request.status} />
          {request.assignedTechnician && (
            <span className="text-xs text-gray-500">
              👤 {request.assignedTechnician.name}
            </span>
          )}
        </div>

        <div className="mt-2 text-xs text-gray-400">
          {new Date(request.requestDate).toLocaleDateString()}
        </div>
      </Link>
    </div>
  );
}

