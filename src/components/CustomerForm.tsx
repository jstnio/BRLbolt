import { useForm } from 'react-hook-form';
import { Customer } from '../types/masterData';
import EntityForm from './EntityForm';
import { Plus, UserPlus, Mail, Phone, Briefcase } from 'lucide-react';

export default function CustomerForm({ entity, onClose }: { entity?: Customer; onClose: () => void }) {
  const form = useForm({
    defaultValues: entity || {
      name: '',
      country: '',
      type: 'shipper',
      taxId: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: ''
      },
      website: '',
      industry: '',
      contacts: [],
      creditTerms: '',
      paymentTerms: '',
      notes: '',
      active: true
    }
  });

  const { register } = form;

  const extraFields = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Type</label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="shipper">Shipper</option>
            <option value="consignee">Consignee</option>
            <option value="both">Both</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax ID</label>
          <input
            type="text"
            {...register('taxId')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Street</label>
            <input
              type="text"
              {...register('address.street')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register('address.city')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              {...register('address.state')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              {...register('address.postalCode')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            {...register('website')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Industry</label>
          <input
            type="text"
            {...register('industry')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Credit Terms</label>
          <input
            type="text"
            {...register('creditTerms')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Payment Terms</label>
          <input
            type="text"
            {...register('paymentTerms')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
          <button
            type="button"
            onClick={() => {
              const contacts = form.getValues('contacts') || [];
              form.setValue('contacts', [...contacts, {
                name: '',
                position: '',
                email: '',
                phone: '',
                mobile: ''
              }]);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-none"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {form.watch('contacts')?.map((contact: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      {...register(`contacts.${index}.name`)}
                      placeholder="Contact Name"
                      className="block w-full border-0 bg-transparent focus:ring-0 sm:text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      {...register(`contacts.${index}.position`)}
                      placeholder="Position"
                      className="block w-full border-0 bg-transparent focus:ring-0 sm:text-sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <input
                          type="email"
                          {...register(`contacts.${index}.email`)}
                          placeholder="Email"
                          className="block w-full border-0 bg-transparent focus:ring-0 sm:text-sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <input
                          type="tel"
                          {...register(`contacts.${index}.phone`)}
                          placeholder="Phone"
                          className="block w-full border-0 bg-transparent focus:ring-0 sm:text-sm"
                        />
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 text-gray-400 mr-2" />
                        <input
                          type="tel"
                          {...register(`contacts.${index}.mobile`)}
                          placeholder="Mobile"
                          className="block w-full border-0 bg-transparent focus:ring-0 sm:text-sm"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={() => {
                        const contacts = form.getValues('contacts');
                        contacts.splice(index, 1);
                        form.setValue('contacts', contacts);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!form.watch('contacts') || form.watch('contacts').length === 0) && (
            <div className="text-center py-12">
              <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new contact</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Additional notes and comments"
        />
      </div>
    </div>
  );

  return (
    <EntityForm
      collectionName="customers"
      entity={entity}
      onClose={onClose}
      title={entity ? 'Edit Customer' : 'Add Customer'}
      extraFields={extraFields}
      form={form}
    />
  );
}