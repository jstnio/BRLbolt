import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipmentStore } from '../store/shipmentStore';
import { AlertTriangle } from 'lucide-react';

interface Props {
  shipmentId: string;
  onClose: () => void;
}

export default function DeleteShipmentModal({ shipmentId, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const { deleteShipment } = useShipmentStore();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteShipment(shipmentId);
      navigate('/manager');
    } catch (error) {
      console.error('Error deleting shipment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
          Delete Shipment
        </h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          Are you sure you want to delete this shipment? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}