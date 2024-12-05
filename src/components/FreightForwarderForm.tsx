import { useForm } from 'react-hook-form';
import { FreightForwarder } from '../types/masterData';
import EntityForm from './EntityForm';
import ContactTable from './ContactTable';
import ShipmentTable from './ShipmentTable';

export default function FreightForwarderForm({ entity, onClose }: { entity?: FreightForwarder; onClose: () => void }) {
  const form = useForm({
    defaultValues: {
      name: entity?.name || '',
      country: entity?.country || '',
      taxId: entity?.taxId || '',
      eori: entity?.eori || '',
      website: entity?.website || '',
      address: {
        street: entity?.address?.street || '',
        city: entity?.address?.city || '',
        state: entity?.address?.state || '',
        postalCode: entity?.address?.postalCode || ''
      },
      phone: entity?.phone || '',
      personnel: {
        directors: entity?.personnel?.directors || [],
        managers: entity?.personnel?.managers || [],
        accounting: entity?.personnel?.accounting || [],
        operations: entity?.personnel?.operations || []
      },
      active: entity?.active ?? true
    }
  });

  const { register } = form;

  const extraFields = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Tax ID</label>
          <input
            type="text"
            {...register('taxId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">EORI Number</label>
          <input
            type="text"
            {...register('eori')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            {...register('website')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              {...register('address.city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              {...register('address.state')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              {...register('address.postalCode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          {...register('phone')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-8">
        <ContactTable
          title="Directors"
          contacts={form.watch('personnel.directors')}
          onAdd={(contact) => {
            const directors = form.getValues('personnel.directors') || [];
            form.setValue('personnel.directors', [...directors, contact]);
          }}
          onUpdate={(index, contact) => {
            const directors = form.getValues('personnel.directors');
            directors[index] = contact;
            form.setValue('personnel.directors', directors);
          }}
          onDelete={(index) => {
            const directors = form.getValues('personnel.directors');
            directors.splice(index, 1);
            form.setValue('personnel.directors', directors);
          }}
        />
        
        <ContactTable
          title="Managers"
          contacts={form.watch('personnel.managers')}
          onAdd={(contact) => {
            const managers = form.getValues('personnel.managers') || [];
            form.setValue('personnel.managers', [...managers, contact]);
          }}
          onUpdate={(index, contact) => {
            const managers = form.getValues('personnel.managers');
            managers[index] = contact;
            form.setValue('personnel.managers', managers);
          }}
          onDelete={(index) => {
            const managers = form.getValues('personnel.managers');
            managers.splice(index, 1);
            form.setValue('personnel.managers', managers);
          }}
        />
        
        <ContactTable
          title="Accounting Staff"
          contacts={form.watch('personnel.accounting')}
          onAdd={(contact) => {
            const accounting = form.getValues('personnel.accounting') || [];
            form.setValue('personnel.accounting', [...accounting, contact]);
          }}
          onUpdate={(index, contact) => {
            const accounting = form.getValues('personnel.accounting');
            accounting[index] = contact;
            form.setValue('personnel.accounting', accounting);
          }}
          onDelete={(index) => {
            const accounting = form.getValues('personnel.accounting');
            accounting.splice(index, 1);
            form.setValue('personnel.accounting', accounting);
          }}
        />
        
        <ContactTable
          title="Operations Staff"
          contacts={form.watch('personnel.operations')}
          onAdd={(contact) => {
            const operations = form.getValues('personnel.operations') || [];
            form.setValue('personnel.operations', [...operations, contact]);
          }}
          onUpdate={(index, contact) => {
            const operations = form.getValues('personnel.operations');
            operations[index] = contact;
            form.setValue('personnel.operations', operations);
          }}
          onDelete={(index) => {
            const operations = form.getValues('personnel.operations');
            operations.splice(index, 1);
            form.setValue('personnel.operations', operations);
          }}
        />
      </div>

      {entity && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Handled Shipments</h3>
          <ShipmentTable agentId={entity.id} />
        </div>
      )}
    </div>
  );

  return (
    <EntityForm
      collectionName="freightForwarders"
      entity={entity}
      onClose={onClose}
      title={entity ? 'Edit International Agent' : 'Add International Agent'}
      extraFields={extraFields}
      form={form}
    />
  );
}