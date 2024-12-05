import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useShipmentStore } from '../store/shipmentStore';
import { Plus, Search, Filter, Package } from 'lucide-react';
import ShipmentList from '../components/ShipmentList';
import { ShipmentStatus, ShipmentType } from '../types';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchShipments, oceanShipments, airShipments, loading } = useShipmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ShipmentType | 'all'>('all');

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const allShipments = [...oceanShipments, ...airShipments];
  
  const filteredShipments = allShipments.filter(shipment => {
    const matchesSearch = 
      (shipment.type === 'ocean' ? shipment.blNumber : shipment.awbNumber)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.shipper?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    const matchesType = typeFilter === 'all' || shipment.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipments</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user?.name}</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/manager/new')}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Shipment
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by tracking number or shipper..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Filter
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ShipmentStatus | 'all')}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="booked">Booked</option>
              <option value="in-transit">In Transit</option>
              <option value="arrived">Arrived</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type Filter
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ShipmentType | 'all')}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Types</option>
              <option value="airfreight">Air Freight</option>
              <option value="ocean">Ocean Freight</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shipments...</p>
        </div>
      ) : (
        <>
          {filteredShipments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => navigate('/manager/new')}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Shipment
              </button>
            </div>
          ) : (
            <ShipmentList shipments={filteredShipments} />
          )}
        </>
      )}
    </div>
  );
}