import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Plus, Trash2, DollarSign, Calculator } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  form: UseFormReturn<any>;
  name: string;
  currency: string;
}

const costCategories = [
  { id: 'freight', name: 'Freight Charges', color: 'blue' },
  { id: 'origin', name: 'Origin Charges', color: 'green' },
  { id: 'destination', name: 'Destination Charges', color: 'purple' },
  { id: 'customs', name: 'Customs Charges', color: 'orange' },
  { id: 'additional', name: 'Additional Charges', color: 'gray' }
];

const commonCharges = {
  freight: [
    { name: 'Ocean/Air Freight', unit: 'Per Shipment' },
    { name: 'Fuel Surcharge (BAF/FSC)', unit: 'Per Shipment' },
    { name: 'Security Fee', unit: 'Per Shipment' },
    { name: 'Carrier Service Fee', unit: 'Per Shipment' }
  ],
  origin: [
    { name: 'Terminal Handling Charge (THC)', unit: 'Per Container' },
    { name: 'Documentation Fee', unit: 'Per Document' },
    { name: 'Export Customs Clearance', unit: 'Per Shipment' },
    { name: 'Pickup & Transportation', unit: 'Per Container' },
    { name: 'Container Seal Fee', unit: 'Per Container' },
    { name: 'VGM Fee', unit: 'Per Container' }
  ],
  destination: [
    { name: 'Terminal Handling Charge (THC)', unit: 'Per Container' },
    { name: 'Documentation Fee', unit: 'Per Document' },
    { name: 'Import Customs Clearance', unit: 'Per Shipment' },
    { name: 'Delivery & Transportation', unit: 'Per Container' },
    { name: 'Container Cleaning', unit: 'Per Container' }
  ],
  customs: [
    { name: 'Customs Duty', unit: 'Per Shipment' },
    { name: 'Import Tax', unit: 'Per Shipment' },
    { name: 'VAT', unit: 'Per Shipment' },
    { name: 'Customs Inspection', unit: 'Per Container' }
  ],
  additional: [
    { name: 'Insurance', unit: 'Per Shipment' },
    { name: 'Warehousing', unit: 'Per Day' },
    { name: 'Special Equipment', unit: 'Per Unit' },
    { name: 'Demurrage & Detention', unit: 'Per Container/Day' },
    { name: 'Fumigation', unit: 'Per Container' }
  ]
};

export default function FreightCostsForm({ form, name, currency }: Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name
  });

  const costs = form.watch(name) || [];

  // Calculate totals whenever costs change
  useEffect(() => {
    const subtotal = costs.reduce((sum, cost) => {
      return sum + (cost.amount * (cost.quantity || 1));
    }, 0);

    const taxRate = form.watch('taxes') || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount;

    form.setValue('subtotal', subtotal);
    form.setValue('total', total);
  }, [costs, form]);

  const addNewCost = (category: string, preset?: { name: string; unit: string }) => {
    append({
      category,
      description: preset?.name || '',
      unit: preset?.unit || 'Per Shipment',
      quantity: 1,
      amount: 0,
      mandatory: category === 'freight',
      notes: ''
    });
  };

  const getCategoryColor = (category: string) => {
    const cat = costCategories.find(c => c.id === category);
    return cat ? cat.color : 'gray';
  };

  const groupedCosts = fields.reduce((acc: any, cost: any, index: number) => {
    if (!acc[cost.category]) {
      acc[cost.category] = [];
    }
    acc[cost.category].push({ ...cost, index });
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
          Freight Costs
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Currency: <span className="font-medium">{currency}</span>
          </div>
          <Calculator className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {costCategories.map(category => (
        <div key={category.id} className="bg-white border border-gray-200 rounded-none shadow-sm">
          <div className={`px-4 py-3 bg-${category.color}-50 border-b border-gray-200 flex justify-between items-center`}>
            <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
            <div className="relative group">
              <button
                type="button"
                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-none text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Charge
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-none shadow-lg border border-gray-200 hidden group-hover:block z-10">
                {commonCharges[category.id as keyof typeof commonCharges].map(charge => (
                  <button
                    key={charge.name}
                    type="button"
                    onClick={() => addNewCost(category.id, charge)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {charge.name}
                  </button>
                ))}
                <div className="border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => addNewCost(category.id)}
                    className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                  >
                    Custom Charge
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {groupedCosts[category.id]?.map((cost: any) => (
              <div key={cost.id} className="p-4 hover:bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <input
                      type="text"
                      {...form.register(`${name}.${cost.index}.description`)}
                      className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      list={`common-charges-${category.id}`}
                    />
                    <datalist id={`common-charges-${category.id}`}>
                      {commonCharges[category.id as keyof typeof commonCharges].map(charge => (
                        <option key={charge.name} value={charge.name} />
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                    <select
                      {...form.register(`${name}.${cost.index}.unit`)}
                      className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Per Shipment">Per Shipment</option>
                      <option value="Per Container">Per Container</option>
                      <option value="Per CBM">Per CBM</option>
                      <option value="Per KG">Per KG</option>
                      <option value="Per Document">Per Document</option>
                      <option value="Per Day">Per Day</option>
                      <option value="Per Container/Day">Per Container/Day</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      {...form.register(`${name}.${cost.index}.quantity`)}
                      className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Amount ({currency})</label>
                    <input
                      type="number"
                      step="0.01"
                      {...form.register(`${name}.${cost.index}.amount`)}
                      className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center h-10">
                      <input
                        type="checkbox"
                        {...form.register(`${name}.${cost.index}.mandatory`)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">Mandatory</label>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(cost.index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    {...form.register(`${name}.${cost.index}.notes`)}
                    placeholder="Add notes (optional)"
                    className="mt-1 block w-full rounded-none border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="mt-2 text-right text-sm text-gray-500">
                  Total: {currency} {(cost.amount * (cost.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}

            {!groupedCosts[category.id]?.length && (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">No charges added yet</p>
                <button
                  type="button"
                  onClick={() => addNewCost(category.id)}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-none text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add {category.name}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="bg-gray-50 p-4 rounded-none border border-gray-200">
        <div className="flex justify-end space-y-2">
          <div className="text-right space-y-1">
            <div className="text-sm text-gray-500">
              Subtotal: {currency} {form.watch('subtotal')?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-gray-500">
              Taxes ({form.watch('taxes')}%): {currency} {((form.watch('subtotal') || 0) * (form.watch('taxes') || 0) / 100).toFixed(2)}
            </div>
            <div className="text-lg font-bold text-gray-900">
              Total: {currency} {form.watch('total')?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}