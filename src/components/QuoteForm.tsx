import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuoteStore } from '../store/quoteStore';
import { useMasterDataStore } from '../store/masterDataStore';
import { useAuthStore } from '../store/authStore';
import { X, FileText } from 'lucide-react';
import { Quote } from '../types/quote';
import CargoItemsForm from './CargoItemsForm';
import FreightCostsForm from './FreightCostsForm';
import QuoteTermsForm from './QuoteTermsForm';

interface Props {
  quote?: Quote;
  onClose: () => void;
}

const freightConditions = [
  'Door to Door',
  'Door to Port',
  'Port to Door',
  'Port to Port',
  'Airport to Airport',
  'Door to Airport',
  'Airport to Door'
];

const incoterms = [
  'EXW - Ex Works',
  'FCA - Free Carrier',
  'CPT - Carriage Paid To',
  'CIP - Carriage and Insurance Paid To',
  'DAP - Delivered at Place',
  'DPU - Delivered at Place Unloaded',
  'DDP - Delivered Duty Paid',
  'FAS - Free Alongside Ship',
  'FOB - Free on Board',
  'CFR - Cost and Freight',
  'CIF - Cost, Insurance and Freight'
];

export default function QuoteForm({ quote, onClose }: Props) {
  const { user } = useAuthStore();
  const { addQuote, updateQuote } = useQuoteStore();
  const { entities, fetchEntities } = useMasterDataStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultValues = {
    type: 'ocean',
    reference: `BRL-Q-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    status: 'draft',
    shipper: {
      id: '',
      name: '',
      company: '',
      email: '',
      phone: ''
    },
    consignee: {
      id: '',
      name: '',
      company: '',
      email: '',
      phone: ''
    },
    agent: {
      id: '',
      name: '',
      company: '',
      email: '',
      phone: ''
    },
    agentReference: '',
    freightCondition: 'Port to Port',
    incoterm: 'FOB - Free on Board',
    origin: {
      name: '',
      city: '',
      country: '',
      code: ''
    },
    destination: {
      name: '',
      city: '',
      country: '',
      code: ''
    },
    cargoDetails: [],
    costs: [],
    subtotal: 0,
    total: 0,
    currency: 'USD',
    validity: {
      issuedDate: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    terms: [
      'Quote validity: 30 days from issue date',
      'Subject to space and equipment availability',
      'Subject to carrier approval',
      'Rates exclude insurance unless specified',
      'Terms and conditions apply'
    ],
    notes: ''
  };

  const form = useForm({
    defaultValues: quote || defaultValues
  });

  const { register, handleSubmit, watch, setValue } = form;
  const quoteType = watch('type');

  useEffect(() => {
    const fetchMasterData = async () => {
      await Promise.all([
        fetchEntities('customers'),
        fetchEntities('freightForwarders'),
        fetchEntities('ports'),
        fetchEntities('airports')
      ]);
    };
    fetchMasterData();
  }, [fetchEntities]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      const shipper = entities.customers?.find(c => c.id === data.shipper.id);
      const consignee = entities.customers?.find(c => c.id === data.consignee.id);
      const agent = entities.freightForwarders?.find(a => a.id === data.agent.id);

      if (!shipper || !consignee) {
        throw new Error('Please select both shipper and consignee');
      }

      const quoteData = {
        ...data,
        shipper: {
          id: shipper.id,
          name: shipper.name,
          company: shipper.company || '',
          email: shipper.email || '',
          phone: shipper.phone || ''
        },
        consignee: {
          id: consignee.id,
          name: consignee.name,
          company: consignee.company || '',
          email: consignee.email || '',
          phone: consignee.phone || ''
        },
        agent: agent ? {
          id: agent.id,
          name: agent.name,
          company: agent.company || '',
          email: agent.email || '',
          phone: agent.phone || ''
        } : null,
        createdBy: {
          id: user!.uid,
          name: user!.name,
          email: user!.email,
        },
        status: 'draft',
        createdAt: quote?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (quote) {
        await updateQuote(quote.id, quoteData);
      } else {
        await addQuote(quoteData);
      }
      onClose();
    } catch (error: any) {
      console.error('Error saving quote:', error);
      setError(error.message || 'Error saving quote');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {quote ? 'Edit Quote' : 'New Quote'}
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
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quote Type
          </label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="ocean">Ocean Freight</option>
            <option value="air">Air Freight</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reference Number
          </label>
          <input
            type="text"
            {...register('reference')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            {...register('currency')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BRL">BRL</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shipper
          </label>
          <select
            {...register('shipper.id')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Shipper</option>
            {entities.customers?.filter(c => c.type === 'shipper' || c.type === 'both').map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.company}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Consignee
          </label>
          <select
            {...register('consignee.id')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Consignee</option>
            {entities.customers?.filter(c => c.type === 'consignee' || c.type === 'both').map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} - {customer.company}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            International Agent
          </label>
          <select
            {...register('agent.id')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Agent</option>
            {entities.freightForwarders?.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name} - {agent.company}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agent Reference
          </label>
          <input
            type="text"
            {...register('agentReference')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Freight Condition
          </label>
          <select
            {...register('freightCondition')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {freightConditions
              .filter(condition => 
                quoteType === 'air' 
                  ? condition.includes('Airport') 
                  : !condition.includes('Airport')
              )
              .map(condition => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))
            }
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Incoterm
          </label>
          <select
            {...register('incoterm')}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {incoterms.map(incoterm => (
              <option key={incoterm} value={incoterm}>
                {incoterm}
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
              <label className="block text-sm font-medium text-gray-700">
                {quoteType === 'air' ? 'Airport' : 'Port'}
              </label>
              <select
                {...register('origin.code')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {
                  const location = quoteType === 'air' 
                    ? entities.airports?.find(a => a.code === e.target.value)
                    : entities.ports?.find(p => p.code === e.target.value);
                  if (location) {
                    setValue('origin.name', location.name);
                    setValue('origin.city', location.city);
                    setValue('origin.country', location.country);
                  }
                }}
              >
                <option value="">Select {quoteType === 'air' ? 'Airport' : 'Port'}</option>
                {(quoteType === 'air' ? entities.airports : entities.ports)?.map(location => (
                  <option key={location.id} value={location.code}>
                    {location.code} - {location.name}
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
              <label className="block text-sm font-medium text-gray-700">
                {quoteType === 'air' ? 'Airport' : 'Port'}
              </label>
              <select
                {...register('destination.code')}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                onChange={(e) => {
                  const location = quoteType === 'air'
                    ? entities.airports?.find(a => a.code === e.target.value)
                    : entities.ports?.find(p => p.code === e.target.value);
                  if (location) {
                    setValue('destination.name', location.name);
                    setValue('destination.city', location.city);
                    setValue('destination.country', location.country);
                  }
                }}
              >
                <option value="">Select {quoteType === 'air' ? 'Airport' : 'Port'}</option>
                {(quoteType === 'air' ? entities.airports : entities.ports)?.map(location => (
                  <option key={location.id} value={location.code}>
                    {location.code} - {location.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <CargoItemsForm form={form} name="cargoDetails" />

      <FreightCostsForm 
        form={form} 
        name="costs" 
        currency={watch('currency')} 
      />

      <QuoteTermsForm form={form} name="terms" />

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          {...register('notes')}
          rows={4}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Additional notes or special instructions..."
        />
      </div>

      <div className="flex justify-end space-x-3">
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
          {loading ? 'Saving...' : (quote ? 'Update Quote' : 'Create Quote')}
        </button>
      </div>
    </form>
  );
}