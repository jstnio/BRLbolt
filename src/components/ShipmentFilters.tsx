import { Search, Filter } from 'lucide-react';
import { ShipmentStatus, ShipmentType } from '../types';

interface Props {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: ShipmentStatus | 'all';
  setStatusFilter: (status: ShipmentStatus | 'all') => void;
  typeFilter: ShipmentType | 'all';
  setTypeFilter: (type: ShipmentType | 'all') => void;
}

export default function ShipmentFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
}: Props) {
  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by tracking number, description, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="flex space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
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
            Type
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
  );
}