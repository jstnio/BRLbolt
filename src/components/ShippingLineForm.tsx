import { useForm } from 'react-hook-form';
import { ShippingLine } from '../types/masterData';
import EntityForm from './EntityForm';

export default function ShippingLineForm({ entity, onClose }: { entity?: ShippingLine; onClose: () => void }) {
  const { register } = useForm({
    defaultValues: entity || {
      name: '',
      country: '',
      office: '',
      phone: '',
      accountExecutive: {
        name: '',
        email: '',
        phone: '',
        mobile: ''
      },
      notes: '',
      active: true
    }
  });

  const extraFields = (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Office</label>
        <input
          type="text"
          {...register('office')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          {...register('phone')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-900">Account Executive</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('accountExecutive.name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('accountExecutive.email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              {...register('accountExecutive.phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mobile</label>
            <input
              type="tel"
              {...register('accountExecutive.mobile')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="General memos and notes"
        />
      </div>
    </div>
  );

  return (
    <EntityForm
      collectionName="shippingLines"
      entity={entity}
      onClose={onClose}
      title={entity ? 'Edit Shipping Line' : 'Add Shipping Line'}
      extraFields={extraFields}
    />
  );
}