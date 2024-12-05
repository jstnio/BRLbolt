import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shipment } from '../types';
import { format } from 'date-fns';
import { Ship, Plane } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ShipmentActions from './ShipmentActions';

interface Props {
  shipments: Shipment[];
}

export default function ShipmentList({ shipments }: Props) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isManager = user?.role === 'manager';

  const getTrackingNumber = (shipment: Shipment) => {
    return shipment.brlReference || (shipment.type === 'airfreight' ? shipment.awbNumber : shipment.blNumber);
  };

  const getShipmentIcon = (type: 'airfreight' | 'ocean') => {
    return type === 'airfreight' ? (
      <Plane className="h-5 w-5 text-blue-500" />
    ) : (
      <Ship className="h-5 w-5 text-blue-500" />
    );
  };

  if (!shipments.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
          {getShipmentIcon('ocean')}
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isManager ? 'Create a new shipment to get started' : 'No shipments available at this time'}
        </p>
        {isManager && (
          <button
            onClick={() => navigate('/manager/new')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create New Shipment
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              BRL Reference
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Origin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destination
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Updated
            </th>
            {isManager && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getShipmentIcon(shipment.type)}
                  <span className="ml-3 text-sm font-medium text-blue-600">
                    {getTrackingNumber(shipment)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={shipment.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shipment.origin?.city}, {shipment.origin?.country}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {shipment.destination?.city}, {shipment.destination?.country}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(shipment.updatedAt), 'MMM d, yyyy')}
              </td>
              {isManager && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <ShipmentActions shipment={shipment} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}