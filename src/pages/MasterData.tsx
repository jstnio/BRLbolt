import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Ship, 
  Anchor, 
  Building2, 
  Truck, 
  Users, 
  Briefcase,
  Factory,
  UserCheck
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const masterDataSections = [
  { 
    id: 'airlines', 
    name: 'Airlines', 
    description: 'Manage airline partners and contacts',
    icon: Plane 
  },
  { 
    id: 'airports', 
    name: 'Airports', 
    description: 'Manage airport information and codes',
    icon: Building2 
  },
  { 
    id: 'customs-brokers', 
    name: 'Customs Brokers', 
    description: 'Manage customs clearance partners',
    icon: Briefcase 
  },
  { 
    id: 'customers', 
    name: 'Customer CRM', 
    description: 'Manage customer relationships and contacts',
    icon: UserCheck 
  },
  { 
    id: 'freight-forwarders', 
    name: 'International Agents', 
    description: 'Manage freight forwarding partners',
    icon: Users 
  },
  { 
    id: 'ports', 
    name: 'Ports', 
    description: 'Manage port information and codes',
    icon: Anchor 
  },
  { 
    id: 'shipping-lines', 
    name: 'Shipping Lines', 
    description: 'Manage shipping line partners',
    icon: Ship 
  },
  { 
    id: 'terminals', 
    name: 'Terminals', 
    description: 'Manage terminal operations',
    icon: Factory 
  },
  { 
    id: 'truckers', 
    name: 'Truckers', 
    description: 'Manage trucking partners',
    icon: Truck 
  },
].sort((a, b) => a.name.localeCompare(b.name));

export default function MasterData() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  if (!user || user.role !== 'manager') {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Data Management
        </h1>
        <p className="text-gray-600">
          Centralized management of business partners and reference data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {masterDataSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    {section.name}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4 min-h-[48px]">
                  {section.description}
                </p>
                <button
                  onClick={() => navigate(`/master-data/${section.id}`)}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Manage {section.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}