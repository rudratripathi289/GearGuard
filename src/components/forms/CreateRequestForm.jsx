import { useState, useEffect } from 'react';
import { Priority } from '../../types';
import { equipmentService } from '../../services/equipmentService';
import Loading from '../common/Loading';
import ErrorState from '../common/ErrorState';

export default function CreateRequestForm({ onSubmit, onCancel, initialEquipmentId = null }) {
  const [formData, setFormData] = useState({
    equipmentId: initialEquipmentId || '',
    issueDescription: '',
    priority: Priority.MEDIUM,
  });
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  useEffect(() => {
    loadEquipment();
  }, []);

  useEffect(() => {
    if (formData.equipmentId) {
      const equipment = equipmentList.find((eq) => eq.id === formData.equipmentId);
      setSelectedEquipment(equipment);
    }
  }, [formData.equipmentId, equipmentList]);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getAll();
      setEquipmentList(response.data);
      if (initialEquipmentId) {
        setFormData((prev) => ({ ...prev, equipmentId: initialEquipmentId }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadEquipment} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Equipment *
        </label>
        <select
          required
          value={formData.equipmentId}
          onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose equipment...</option>
          {equipmentList.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.name} - {eq.location}
            </option>
          ))}
        </select>
      </div>

      {selectedEquipment && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Equipment Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 font-medium">{selectedEquipment.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Location:</span>
              <span className="ml-2 font-medium">{selectedEquipment.location}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 font-medium">{selectedEquipment.status}</span>
            </div>
            {selectedEquipment.description && (
              <div className="col-span-2">
                <span className="text-gray-600">Description:</span>
                <span className="ml-2">{selectedEquipment.description}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Issue Description *
        </label>
        <textarea
          required
          value={formData.issueDescription}
          onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
          rows="5"
          placeholder="Describe the issue or maintenance needed..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority *
        </label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={Priority.LOW}>Low</option>
          <option value={Priority.MEDIUM}>Medium</option>
          <option value={Priority.HIGH}>High</option>
          <option value={Priority.CRITICAL}>Critical</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
}

