import { useState } from 'react';
import { STATUS_LABELS } from '../../utils/constants';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ status, requests, onDrop }) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const requestId = e.dataTransfer.getData('requestId');
    if (requestId) {
      onDrop(requestId, status);
    }
  };

  const statusLabel = STATUS_LABELS[status] || status;
  const count = requests.length;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-w-[280px] bg-gray-50 rounded-lg p-4 ${
        isOver ? 'bg-blue-50 border-2 border-blue-300' : 'border border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{statusLabel}</h3>
        <span className="bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-600">
          {count}
        </span>
      </div>
      <div className="space-y-2 min-h-[200px]">
        {requests.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            No requests
          </div>
        ) : (
          requests.map((request) => (
            <KanbanCard key={request.id} request={request} />
          ))
        )}
      </div>
    </div>
  );
}

