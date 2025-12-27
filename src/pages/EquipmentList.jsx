import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { equipmentService } from '../services/equipmentService';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import EquipmentModal from '../components/modals/EquipmentModal';
import { EquipmentStatus } from '../types';

export default function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getAll();
      setEquipment(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingEquipment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (eq) => {
    setEditingEquipment(eq);
    setIsModalOpen(true);
  };

  const handleSave = async (equipmentData) => {
    try {
      if (editingEquipment) {
        await equipmentService.update(editingEquipment.id, equipmentData);
      } else {
        await equipmentService.create(equipmentData);
      }
      setIsModalOpen(false);
      setEditingEquipment(null);
      loadEquipment();
    } catch (err) {
      alert('Failed to save equipment: ' + err.message);
    }
  };

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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadEquipment} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Equipment</h1>
          <p className="text-gray-600">Manage all equipment in the system</p>
        </div>
        {isAdmin() && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            + Add Equipment
          </button>
        )}
      </div>

      {equipment.length === 0 ? (
        <EmptyState
          icon="🔧"
          title="No equipment found"
          message="Get started by adding your first piece of equipment."
          action={
            isAdmin() && (
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Equipment
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((eq) => (
            <div
              key={eq.id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Link
                    to={`/equipment/${eq.id}`}
                    className="text-xl font-semibold text-gray-800 hover:text-blue-600"
                  >
                    {eq.name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{eq.category}</p>
                </div>
                {isAdmin() && (
                  <button
                    onClick={() => handleEdit(eq)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✏️
                  </button>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Location:</span>
                  {eq.location}
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-600 mr-2">Status:</span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(
                      eq.status
                    )}`}
                  >
                    {eq.status.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {eq.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{eq.description}</p>
              )}

              <Link
                to={`/equipment/${eq.id}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}

      <EquipmentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEquipment(null);
        }}
        onSave={handleSave}
        equipment={editingEquipment}
      />
    </div>
  );
}

