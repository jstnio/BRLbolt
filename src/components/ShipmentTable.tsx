import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Ship, Plane } from 'lucide-react';
import { format } from 'date-fns';
import StatusBadge from './StatusBadge';

interface Props {
  agentId: string;
}

export default function ShipmentTable({ agentId }: Props) {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const oceanQuery = query(
          collection(db, 'oceanShipments'),
          where('agent.id', '==', agentId),
          orderBy('createdAt', 'desc')
        );
        
        const airQuery = query(
          collection(db, 'airShipments'),
          where('agent.id', '==', agentId),
          orderBy('createdAt', 'desc')
        );

        const [oceanDocs, airDocs] = await Promise.all([
          getDocs(oceanQuery),
          getDocs(airQuery)
        ]);

        const oceanShipments = oceanDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'ocean'
        }));

        const airShipments = airDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'air'
        }));

        setShipments([...oceanShipments, ...airShipments].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [agentId]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No shipments found for this agent
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference
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
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shipments.map((shipment) => (
            <tr key={shipment.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {shipment.type === 'ocean' ? (
                    <Ship className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Plane className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {shipment.type === 'ocean' ? shipment.blNumber : shipment.awbNumber}
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
                {format(new Date(shipment.createdAt), 'MMM d, yyyy')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}