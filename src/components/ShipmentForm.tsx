import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useShipmentStore } from '../store/shipmentStore';
import { useAuthStore } from '../store/authStore';
import { X } from 'lucide-react';
import { Shipment } from '../types';

interface Props {
  onClose: () => void;
  shipment?: Shipment;
}

export default function ShipmentForm({ onClose, shipment }: Props) {
  const { user } = useAuthStore();
  const { addShipment, updateShipment } = useShipmentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: shipment || {
      type: 'airfreight',
      status: 'booked',
      awbNumber: '',
      blNumber: '',
      cargoDescription: '',
      weight: 0,
      dimensions: '',
      packageCount: 1,
      origin: { city: '', country: '' },
      destination: { city: '', country: '' },
      carrier: '',
      estimatedDeparture: '',
      estimatedArrival: '',
      specialInstructions: '',
      managerNotes: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      const shipmentData = {
        ...data,
        shipper: {
          userId: user!.uid,
          name: user!.name,
          company: user!.company,
          email: user!.email,
        },
        trackingHistory: [{
          timestamp: new Date().toISOString(),
          status: data.status,
          description: shipment ? 'Shipment updated' : 'Shipment created',
        }],
        createdAt: shipment?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (shipment) {
        await updateShipment(shipment.id, shipmentData);
      } else {
        await addShipment(shipmentData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {shipment ? 'Edit Shipment' : 'Create New Shipment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Form content remains the same */}
          {/* ... */}
        </form>
      </div>
    </div>
  );
}