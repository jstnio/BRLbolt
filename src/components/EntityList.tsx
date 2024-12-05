import { useEffect, useState } from 'react';
import { useMasterDataStore } from '../store/masterDataStore';
import { BaseEntity } from '../types/masterData';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import EntityForm from './EntityForm';

interface Props {
  collectionName: string;
  title: string;
  renderExtraFields?: (entity: BaseEntity) => React.ReactNode;
  formExtraFields?: React.ReactNode;
}

export default function EntityList({ 
  collectionName, 
  title,
  renderExtraFields,
  formExtraFields
}: Props) {
  const { entities, loading, fetchEntities, deleteEntity } = useMasterDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<BaseEntity | undefined>();

  useEffect(() => {
    fetchEntities(collectionName);
  }, [collectionName]);

  const handleEdit = (entity: BaseEntity) => {
    setSelectedEntity(entity);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteEntity(collectionName, id);
      } catch (error) {
        console.error('Error deleting entity:', error);
      }
    }
  };

  const filteredEntities = entities[collectionName]?.filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entity.country.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-2 text-gray-600">
            Manage {title.toLowerCase()} information
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedEntity(undefined);
            setShowForm(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {renderExtraFields && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Additional Info
                  </th>
                )}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntities.map((entity) => (
                <tr key={entity.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entity.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entity.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      entity.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entity.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {renderExtraFields && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {renderExtraFields(entity)}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(entity)}
                      className="text-yellow-600 hover:text-yellow-900 mx-2"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(entity.id)}
                      className="text-red-600 hover:text-red-900 mx-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEntities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <EntityForm
          collectionName={collectionName}
          entity={selectedEntity}
          onClose={() => {
            setShowForm(false);
            setSelectedEntity(undefined);
          }}
          title={`${selectedEntity ? 'Edit' : 'Add'} ${title}`}
          extraFields={formExtraFields}
        />
      )}
    </div>
  );
}