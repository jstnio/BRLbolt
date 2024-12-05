import { useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { useMasterDataStore } from '../store/masterDataStore';
import { BaseEntity } from '../types/common';
import { X } from 'lucide-react';
import ContactPersonFields from './ContactPersonFields';

interface Props {
  collectionName: string;
  entity?: BaseEntity;
  onClose: () => void;
  title: string;
  extraFields?: React.ReactNode;
  form?: UseFormReturn<any>;
}

export default function EntityForm({ collectionName, entity, onClose, title, extraFields, form }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addEntity, updateEntity } = useMasterDataStore();

  const defaultForm = useForm({
    defaultValues: entity || {
      name: '',
      country: '',
      active: true,
      code: '',
      city: '',
      type: collectionName === 'airports' ? 'international' : 'seaport',
      terminals: [],
      contacts: []
    },
  });

  const { handleSubmit, register } = form || defaultForm;

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      const formData = {
        ...data,
        updatedAt: new Date().toISOString(),
        createdAt: entity?.createdAt || new Date().toISOString(),
      };

      if (entity) {
        await updateEntity(collectionName, entity.id, formData);
      } else {
        await addEntity(collectionName, formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving data');
    } finally {
      setLoading(false);
    }
  };

  const isAirportOrPort = collectionName === 'airports' || collectionName === 'ports';

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name *
              </label>
              <input
                type="text"
                {...(form || defaultForm).register('name', { required: 'Name is required' })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {isAirportOrPort && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Code *
                </label>
                <input
                  type="text"
                  {...(form || defaultForm).register('code', { required: 'Code is required' })}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={collectionName === 'airports' ? 'IATA/ICAO Code' : 'UN/LOCODE'}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                {...(form || defaultForm).register('city', { required: 'City is required' })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <input
                type="text"
                {...(form || defaultForm).register('country', { required: 'Country is required' })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {isAirportOrPort && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  {...(form || defaultForm).register('type')}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {collectionName === 'airports' ? (
                    <>
                      <option value="international">International</option>
                      <option value="domestic">Domestic</option>
                    </>
                  ) : (
                    <>
                      <option value="seaport">Seaport</option>
                      <option value="river">River Port</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>

          {extraFields}

          {isAirportOrPort && (
            <ContactPersonFields
              form={form || defaultForm}
              fieldArrayName="contacts"
              title="Contact Information"
            />
          )}

          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              {...(form || defaultForm).register('active')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Active
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : (entity ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}