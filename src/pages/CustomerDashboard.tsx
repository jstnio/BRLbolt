import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useShipmentStore } from '../store/shipmentStore';
import { getDocs } from 'firebase/firestore';
import { Search, Ship, Plane, Truck, Package, AlertCircle } from 'lucide-react';
import { Shipment } from '../types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { getCustomerShipments, searchShipments } from '../lib/firebase';
import { showError } from '../lib/utils';

export default function CustomerDashboard() {
  const { user } = useAuthStore();
  const { setOceanShipments, setAirShipments, setTruckShipments, oceanShipments, airShipments, truckShipments, loading } = useShipmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'ocean' | 'airfreight' | 'truck'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Shipment[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const allShipments = [...oceanShipments, ...airShipments, ...truckShipments];
  
  const filteredShipments = allShipments.filter(shipment => {
    const matchesType = selectedType === 'all' || shipment.type === selectedType;
    return matchesType;
  });

  const displayedShipments = hasSearched ? searchResults : filteredShipments;

  useEffect(() => {
    const fetchShipments = async () => {
      if (user) {
        try {
          const queries = getCustomerShipments(user.uid);
          const [oceanSnapshot, airSnapshot, truckSnapshot] = await Promise.all([
            getDocs(queries.ocean),
            getDocs(queries.air),
            getDocs(queries.truck)
          ]);

          const oceanData = oceanSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          const airData = airSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          const truckData = truckSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setOceanShipments(oceanData);
          setAirShipments(airData);
          setTruckShipments(truckData);
        } catch (error) {
          console.error('Error fetching shipments:', error);
          showError('Failed to fetch shipments');
        }
      }
    };

    fetchShipments();
  }, [user, setOceanShipments, setAirShipments, setTruckShipments]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      showError('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const results = await searchShipments(searchTerm.trim());
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching shipments:', error);
      showError('Failed to search shipments');
    } finally {
      setIsSearching(false);
    }
  };

  const getTrackingNumber = (shipment: Shipment) => {
    switch (shipment.type) {
      case 'ocean':
        return `BL: ${shipment.blNumber}`;
      case 'airfreight':
        return `AWB: ${shipment.awbNumber}`;
      case 'truck':
        return `CRT: ${shipment.crtNumber}`;
    }
  };

  const getShipmentIcon = (type: 'ocean' | 'airfreight' | 'truck') => {
    switch (type) {
      case 'ocean':
        return <Ship className="h-5 w-5 text-blue-500" />;
      case 'airfreight':
        return <Plane className="h-5 w-5 text-blue-500" />;
      case 'truck':
        return <Truck className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Shipments</h1>
            <p className="mt-2 text-gray-600">Welcome back, {user?.name}</p>
          </div>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter BL, AWB, or CRT number to track your shipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <Button
            onClick={handleSearch}
            loading={isSearching}
            className="px-6"
          >
            <Search className="h-4 w-4 mr-2" />
            Track Shipment
          </Button>
        </div>

        {!hasSearched && (
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedType('ocean')}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedType === 'ocean'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Ship className="h-4 w-4 mr-2" />
              Ocean
            </button>
            <button
              onClick={() => setSelectedType('airfreight')}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedType === 'airfreight'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Plane className="h-4 w-4 mr-2" />
              Air
            </button>
            <button
              onClick={() => setSelectedType('truck')}
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedType === 'truck'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Truck className="h-4 w-4 mr-2" />
              Truck
            </button>
          </div>
        )}

        {hasSearched && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {searchResults.length === 0 ? 'No shipments found' : `Found ${searchResults.length} shipment(s)`}
            </p>
            <button
              onClick={() => {
                setHasSearched(false);
                setSearchTerm('');
                setSearchResults([]);
              }}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading shipments...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedShipments.map((shipment) => (
            <motion.div
              key={shipment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <Link to={`/shipment/${shipment.id}`} className="block p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getShipmentIcon(shipment.type)}
                    <span className="ml-2 text-sm font-medium text-blue-600">
                      {getTrackingNumber(shipment)}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    shipment.status === 'arrived' ? 'bg-green-100 text-green-800' :
                    shipment.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                    shipment.status === 'delayed' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {shipment.status.replace('-', ' ').charAt(0).toUpperCase() + shipment.status.slice(1)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-gray-500">From:</span>{' '}
                    <span className="font-medium text-gray-900">{shipment.origin.city}, {shipment.origin.country}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">To:</span>{' '}
                    <span className="font-medium text-gray-900">{shipment.destination.city}, {shipment.destination.country}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">ETA:</span>{' '}
                    <span className="font-medium text-gray-900">
                      {new Date(shipment.schedule.estimatedArrival).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && displayedShipments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          {hasSearched ? (
            <>
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No shipments found with the tracking number: {searchTerm}
              </p>
            </>
          ) : (
            <>
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any active shipments at the moment
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}