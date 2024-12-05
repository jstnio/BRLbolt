import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useShipmentStore } from '../store/shipmentStore';
import { useMasterDataStore } from '../store/masterDataStore';
import { useAuthStore } from '../store/authStore';
import { X } from 'lucide-react';
import { OceanFreightShipment } from '../types';
import ContainerListForm from './ContainerListForm';

interface Props {
  shipment?: OceanFreightShipment;
  onClose: () => void;
}

export default function OceanShipmentForm({ onClose, shipment }: Props) {
  const { user } = useAuthStore();
  const { addOceanShipment, updateOceanShipment } = useShipmentStore();
  const { entities, fetchEntities } = useMasterDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    defaultValues: shipment || {
      type: 'ocean',
      status: 'booked',
      brlReference: '',
      shipperReference: '',
      consigneeReference: '',
      agentReference: '',
      blNumber: '',
      shipper: null,
      consignee: null,
      agent: null,
      shippingLine: null,
      customsBroker: null,
      trucker: null,
      origin: {
        city: '',
        country: '',
        port: null
      },
      destination: {
        city: '',
        country: '',
        port: null
      },
      schedule: {
        draftBlDate: '',
        vgmDeadline: '',
        cargoCutOff: '',
        estimatedDeparture: '',
        actualDeparture: '',
        estimatedArrival: '',
        actualArrival: ''
      },
      containers: [],
      cargoDetails: [],
      dueNumber: '',
      customsStatus: 'Green',
      specialInstructions: '',
      active: true
    }
  });

  const { handleSubmit, register } = form;

  // Fetch all required master data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      await Promise.all([
        fetchEntities('customers'),
        fetchEntities('freightForwarders'),
        fetchEntities('shippingLines'),
        fetchEntities('ports'),
        fetchEntities('customsBrokers'),
        fetchEntities('truckers')
      ]);
    };
    fetchMasterData();
  }, [fetchEntities]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      const shipmentData = {
        ...data,
        manager: {
          uid: user!.uid,
          name: user!.name,
          email: user!.email,
        },
        trackingHistory: [{
          timestamp: new Date().toISOString(),
          status: data.status,
          description: shipment ? 'Shipment updated' : 'Ocean shipment created',
        }],
        createdAt: shipment?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (shipment) {
        await updateOceanShipment(shipment.id, shipmentData);
      } else {
        await addOceanShipment(shipmentData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {shipment ? 'Edit Ocean Shipment' : 'New Ocean Shipment'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            BRL Reference
          </label>
          <input
            type="text"
            {...register('brlReference')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            B/L Number
          </label>
          <input
            type="text"
            {...register('blNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shipper Reference
          </label>
          <input
            type="text"
            {...register('shipperReference')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Consignee Reference
          </label>
          <input
            type="text"
            {...register('consigneeReference')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent Reference
          </label>
          <input
            type="text"
            {...register('agentReference')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="booked">Booked</option>
            <option value="in-transit">In Transit</option>
            <option value="arrived">Arrived</option>
            <option value="delayed">Delayed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shipper
          </label>
          <select
            {...register('shipper')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Shipper</option>
            {entities.customers?.filter(c => c.type === 'shipper' || c.type === 'both').map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Consignee
          </label>
          <select
            {...register('consignee')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Consignee</option>
            {entities.customers?.filter(c => c.type === 'consignee' || c.type === 'both').map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            International Agent
          </label>
          <select
            {...register('agent')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Agent</option>
            {entities.freightForwarders?.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Origin</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                {...register('origin.city')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                {...register('origin.country')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Port</label>
              <select
                {...register('origin.port')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Port</option>
                {entities.ports?.map(port => (
                  <option key={port.id} value={port.id}>
                    {port.code} - {port.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Destination</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                {...register('destination.city')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                {...register('destination.country')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Port</label>
              <select
                {...register('destination.port')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Port</option>
                {entities.ports?.map(port => (
                  <option key={port.id} value={port.id}>
                    {port.code} - {port.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Draft B/L Date</label>
            <input
              type="date"
              {...register('schedule.draftBlDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">VGM Deadline</label>
            <input
              type="date"
              {...register('schedule.vgmDeadline')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cargo Cut-Off</label>
            <input
              type="date"
              {...register('schedule.cargoCutOff')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Est. Departure</label>
            <input
              type="date"
              {...register('schedule.estimatedDeparture')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Act. Departure</label>
            <input
              type="date"
              {...register('schedule.actualDeparture')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Est. Arrival</label>
            <input
              type="date"
              {...register('schedule.estimatedArrival')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Act. Arrival</label>
            <input
              type="date"
              {...register('schedule.actualArrival')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <ContainerListForm form={form} name="containers" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">DUE/RUC Number</label>
          <input
            type="text"
            {...register('dueNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Customs Status</label>
          <select
            {...register('customsStatus')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Green">Green</option>
            <option value="Yellow">Yellow</option>
            <option value="Red">Red</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Shipping Line</label>
          <select
            {...register('shippingLine')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Shipping Line</option>
            {entities.shippingLines?.map(line => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Customs Broker</label>
          <select
            {...register('customsBroker')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Customs Broker</option>
            {entities.customsBrokers?.map(broker => (
              <option key={broker.id} value={broker.id}>
                {broker.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Trucker</label>
          <select
            {...register('trucker')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Trucker</option>
            {entities.truckers?.map(trucker => (
              <option key={trucker.id} value={trucker.id}>
                {trucker.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Special Instructions
        </label>
        <textarea
          {...register('specialInstructions')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter any special handling instructions or notes..."
        />
      </div>

      <div className="flex justify-end space-x-3 sticky bottom-0 bg-white p-4 border-t shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : (shipment ? 'Update Shipment' : 'Create Shipment')}
        </button>
      </div>
    </form>
  );
}