import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { Shipment } from '../types';
import { format, isValid } from 'date-fns';
import { Package, Calendar, MapPin, User, Edit, Clock, Trash2, Ship, Plane } from 'lucide-react';
import OceanShipmentForm from '../components/OceanShipmentForm';
import AirShipmentForm from '../components/AirShipmentForm';
import DeleteShipmentModal from '../components/DeleteShipmentModal';
import StatusBadge from '../components/StatusBadge';

const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return isValid(date) ? format(date, 'PPp') : 'Invalid date';
};

export default function ShipmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShipment = async () => {
      if (!id) return;
      try {
        setLoading(true);
        let shipmentDoc = await getDoc(doc(db, 'oceanShipments', id));
        let type = 'ocean';
        
        if (!shipmentDoc.exists()) {
          shipmentDoc = await getDoc(doc(db, 'airShipments', id));
          type = 'airfreight';
        }

        if (shipmentDoc.exists()) {
          setShipment({ 
            id: shipmentDoc.id, 
            type,
            ...shipmentDoc.data() 
          } as Shipment);
        } else {
          setError('Shipment not found');
        }
      } catch (error) {
        console.error('Error fetching shipment:', error);
        setError('Error loading shipment details');
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shipment details...</p>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{error}</h3>
          <div className="mt-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {shipment.type === 'airfreight' ? (
                <Plane className="h-8 w-8 text-white mr-3" />
              ) : (
                <Ship className="h-8 w-8 text-white mr-3" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {shipment.type === 'airfreight' ? shipment.awbNumber : shipment.blNumber}
                </h1>
                <p className="text-blue-100">
                  {shipment.type === 'airfreight' ? 'Air Freight' : 'Ocean Freight'}
                </p>
              </div>
            </div>
            {user?.role === 'manager' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <StatusBadge status={shipment.status} />
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Last Updated: {formatDate(shipment.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Schedule</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ETD:</span>
                  <span className="text-sm font-medium">
                    {formatDate(shipment.schedule?.estimatedDeparture)}
                  </span>
                </div>
                {shipment.schedule?.actualDeparture && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ATD:</span>
                    <span className="text-sm font-medium">
                      {formatDate(shipment.schedule.actualDeparture)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">ETA:</span>
                  <span className="text-sm font-medium">
                    {formatDate(shipment.schedule?.estimatedArrival)}
                  </span>
                </div>
                {shipment.schedule?.actualArrival && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">ATA:</span>
                    <span className="text-sm font-medium">
                      {formatDate(shipment.schedule.actualArrival)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Origin</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">
                    {shipment.origin.city}, {shipment.origin.country}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Destination</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-900">
                    {shipment.destination.city}, {shipment.destination.country}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cargo Details</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">{shipment.cargoDescription}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Weight</h4>
                    <p className="text-sm text-gray-900">{shipment.weight} kg</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Packages</h4>
                    <p className="text-sm text-gray-900">{shipment.packageCount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {shipment.type === 'ocean' ? (
              <OceanShipmentForm
                shipment={shipment}
                onClose={() => setShowEditForm(false)}
              />
            ) : (
              <AirShipmentForm
                shipment={shipment}
                onClose={() => setShowEditForm(false)}
              />
            )}
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteShipmentModal
          shipmentId={shipment.id}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}