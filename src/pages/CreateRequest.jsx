import { useNavigate, useSearchParams } from 'react-router-dom';
import { requestService } from '../services/requestService';
import CreateRequestForm from '../components/forms/CreateRequestForm';
import Loading from '../components/common/Loading';
import { useState } from 'react';

export default function CreateRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get('equipmentId');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await requestService.create({
        ...formData,
        requestDate: new Date().toISOString(),
      });
      navigate('/requests');
    } catch (error) {
      alert('Failed to create request: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Creating request..." />;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Maintenance Request</h1>
        <p className="text-gray-600">Submit a new maintenance request for equipment</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <CreateRequestForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/requests')}
          initialEquipmentId={equipmentId}
        />
      </div>
    </div>
  );
}

