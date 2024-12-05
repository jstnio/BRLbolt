import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Ship, Plane } from 'lucide-react';
import OceanShipmentForm from '../components/OceanShipmentForm';
import AirShipmentForm from '../components/AirShipmentForm';

export default function NewShipment() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [shipmentType, setShipmentType] = useState<'ocean' | 'air' | null>(null);

  if (!user || user.role !== 'manager') {
    return null;
  }

  if (!shipmentType) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Shipment</h1>
          <p className="mt-2 text-gray-600">Select the type of shipment you want to create</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ocean Freight Option */}
          <button
            onClick={() => setShipmentType('ocean')}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500 focus:outline-none focus:border-blue-500"
          >
            <Ship className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ocean Freight</h2>
            <p className="text-gray-600">
              Create a new ocean freight shipment with container and vessel details
            </p>
          </button>

          {/* Air Freight Option */}
          <button
            onClick={() => setShipmentType('air')}
            className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500 focus:outline-none focus:border-blue-500"
          >
            <Plane className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Air Freight</h2>
            <p className="text-gray-600">
              Create a new air freight shipment with flight and cargo details
            </p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {shipmentType === 'ocean' ? (
              <Ship className="h-8 w-8 text-blue-600" />
            ) : (
              <Plane className="h-8 w-8 text-blue-600" />
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              Create New {shipmentType === 'ocean' ? 'Ocean' : 'Air'} Freight Shipment
            </h1>
          </div>
          <button
            onClick={() => setShipmentType(null)}
            className="text-blue-600 hover:text-blue-700"
          >
            Change Type
          </button>
        </div>
        <p className="mt-2 text-gray-600">Enter the shipment details below</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        {shipmentType === 'ocean' ? (
          <OceanShipmentForm onClose={() => navigate('/manager')} />
        ) : (
          <AirShipmentForm onClose={() => navigate('/manager')} />
        )}
      </div>
    </div>
  );
}