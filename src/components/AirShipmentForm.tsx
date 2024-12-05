import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useShipmentStore } from '../store/shipmentStore';
import { useMasterDataStore } from '../store/masterDataStore';
import { useAuthStore } from '../store/authStore';
import { X } from 'lucide-react';
import { AirFreightShipment } from '../types';
import CargoItemsForm from './CargoItemsForm';

interface Props {
  shipment?: AirFreightShipment;
  onClose: () => void;
}

export default function AirShipmentForm({ onClose, shipment }: Props) {
  const { user } = useAuthStore();
  const { addAirShipment, updateAirShipment } = useShipmentStore();
  const { entities, fetchEntities } = useMasterDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    defaultValues: shipment || {
      type: 'airfreight',
      status: 'booked',
      brlReference: '',
      shipperReference: '',
      consigneeReference: '',
      agentReference: '',
      awbNumber: '',
      shipper: null,
      consignee: null,
      agent: null,
      airline: null,
      customsBroker: null,
      trucker: null,
      origin: {
        city: '',
        country: '',
        airportCode: '',
        airportName: ''
      },
      destination: {
        city: '',
        country: '',
        airportCode: '',
        airportName: ''
      },
      schedule: {
        estimatedDeparture: '',
        actualDeparture: '',
        estimatedArrival: '',
        actualArrival: ''
      },
      cargoItems: [],
      dueNumber: '',
      customsStatus: 'Green',
      specialInstructions: '',
      active: true
    }
  });

  const { handleSubmit, register } = form;

  useEffect(() => {
    const fetchMasterData = async () => {
      await Promise.all([
        fetchEntities('customers'),
        fetchEntities('freightForwarders'),
        fetchEntities('airlines'),
        fetchEntities('airports'),
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
          description: shipment ? 'Shipment updated' : 'Air shipment created',
        }],
        createdAt: shipment?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (shipment) {
        await updateAirShipment(shipment.id, shipmentData);
      } else {
        await addAirShipment(shipmentData);
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
          {shipment ? 'Edit Air Shipment' : 'New Air Shipment'}
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
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            AWB Number
          </label>
          <input
            type="text"
            {...register('awbNumber')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shipper Reference
          </label>
          <input
            type="text"
            {...register('shipperReference')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Consignee Reference
          </label>
          <input
            type="text"
            {...register('consigneeReference')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent Reference
          </label>
          <input
            type="text"
            {...register('agentReference')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700">Airport</label>
              <select
                {...register('origin.airport')}
                className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {
                  const airport = entities.airports?.find(a => a.id === e.target.value);
                  if (airport) {
                    form.setValue('origin.city', airport.city || '');
                    form.setValue('origin.country', airport.country || '');
                    form.setValue('origin.airportCode', airport.code || '');
                    form.setValue('origin.airportName', airport.name || '');
                  }
                }}
              >
                <option value="">Select Airport</option>
                {entities.airports?.map(airport => (
                  <option key={airport.id} value={airport.id}>
                    {airport.code} - {airport.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                {...register('origin.city')}
                className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                {...register('origin.country')}
                className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Destination</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Airport</label>
              <select
                {...register('destination.airport')}
                className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {
                  const airport = entities.airports?.find(a => a.id === e.target.value);
                  if (airport) {
                    form.setValue('destination.city', airport.city || '');
                    form.setValue('destination.country', airport.country || '');
                    form.setValue('destination.airportCode', airport.code || '');
                    form.setValue('destination.airportName', airport.name || '');
                  }
                }}
              >
                <option value="">Select Airport</option>
                {entities.airports?.map(airport => (
                  <option key={airport.id} value={airport.id}>
                    {airport.code} - {airport.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                {...register('destination.city')}
                className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                {...register('destination.country')}
                className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Est. Departure</label>
            <input
              type="datetime-local"
              {...register('schedule.estimatedDeparture')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Act. Departure</label>
            <input
              type="datetime-local"
              {...register('schedule.actualDeparture')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Est. Arrival</label>
            <input
              type="datetime-local"
              {...register('schedule.estimatedArrival')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Act. Arrival</label>
            <input
              type="datetime-local"
              {...register('schedule.actualArrival')}
              className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <CargoItemsForm form={form} name="cargoItems" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">DUE/RUC Number</label>
          <input
            type="text"
            {...register('dueNumber')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Customs Status</label>
          <select
            {...register('customsStatus')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Green">Green</option>
            <option value="Yellow">Yellow</option>
            <option value="Red">Red</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Airline</label>
          <select
            {...register('airline')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Airline</option>
            {entities.airlines?.map(airline => (
              <option key={airline.id} value={airline.id}>
                {airline.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Customs Broker</label>
          <select
            {...register('customsBroker')}
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter any special handling instructions or notes..."
        />
      </div>

      <div className="flex justify-end space-x-3 sticky bottom-0 bg-white p-4 border-t shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-none shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-none shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : (shipment ? 'Update Shipment' : 'Create Shipment')}
        </button>
      </div>
    </form>
  );
}