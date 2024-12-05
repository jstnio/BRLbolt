import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Plus, Trash2, Package } from 'lucide-react';

interface Props {
  form: UseFormReturn<any>;
  name: string;
}

export default function CargoItemsForm({ form, name }: Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name
  });

  const addNewCargoItem = () => {
    append({
      description: '',
      grossWeight: 0,
      netWeight: 0,
      pieces: 1,
      packageType: 'Carton',
      ncmHsCode: '',
      volume: 0
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Package className="h-5 w-5 mr-2 text-blue-600" />
          Cargo Details
        </h3>
        <button
          type="button"
          onClick={addNewCargoItem}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Cargo Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[30%]">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Package Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Pieces</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Gross (kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Net (kg)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Volume (m³)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">NCM / HS</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[5%]"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.map((field, index) => (
              <tr key={field.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <input
                    type="text"
                    {...form.register(`${name}.${index}.description`)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    {...form.register(`${name}.${index}.packageType`)}
                    className="rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Carton">Carton</option>
                    <option value="Pallet">Pallet</option>
                    <option value="Crate">Crate</option>
                    <option value="Drum">Drum</option>
                    <option value="Box">Box</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    {...form.register(`${name}.${index}.pieces`)}
                    className="w-20 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    step="0.01"
                    {...form.register(`${name}.${index}.grossWeight`)}
                    className="w-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    step="0.01"
                    {...form.register(`${name}.${index}.netWeight`)}
                    className="w-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="number"
                    step="0.01"
                    {...form.register(`${name}.${index}.volume`)}
                    className="w-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <input
                    type="text"
                    {...form.register(`${name}.${index}.ncmHsCode`)}
                    className="w-32 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Code"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:text-red-900"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {fields.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cargo items</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new cargo item
            </p>
            <button
              type="button"
              onClick={addNewCargoItem}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Cargo Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}