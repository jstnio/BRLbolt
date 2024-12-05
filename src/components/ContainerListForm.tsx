import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Plus, Trash2, Container, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
  form: UseFormReturn<any>;
  name: string;
}

const containerStatuses = [
  'To be retrieved',
  'Positioned for loading',
  'Ready to pick up',
  'Deposited 3rd yard',
  'Delivered to terminal'
];

const containerTypes = [
  { value: '20GP', label: "20' General Purpose" },
  { value: '40GP', label: "40' General Purpose" },
  { value: '40HC', label: "40' High Cube" },
  { value: '45HC', label: "45' High Cube" },
  { value: '20RF', label: "20' Reefer" },
  { value: '40RF', label: "40' Reefer" }
];

export default function ContainerListForm({ form, name }: Props) {
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name
  });

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempItem, setTempItem] = useState<any>(null);

  const addNewContainer = () => {
    const newItem = {
      type: '20GP',
      number: '',
      sealNumber: '',
      tare: '',
      vgm: '',
      status: 'To be retrieved'
    };
    
    if (editingIndex !== null) {
      update(editingIndex, newItem);
      setEditingIndex(null);
    } else {
      append(newItem);
    }
    setTempItem(null);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setTempItem(fields[index]);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setTempItem(null);
  };

  return (
    <div className="space-y-6 bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Container className="h-5 w-5 mr-2 text-blue-600" />
          Container Details
        </h3>
        <button
          type="button"
          onClick={() => {
            setEditingIndex(null);
            setTempItem(null);
            addNewContainer();
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Container
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Type</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">Number</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Seal</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">Tare (kg)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">VGM (kg)</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[18%]">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fields.map((field, index) => (
              <tr key={field.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingIndex === index ? (
                    <select
                      {...form.register(`${name}.${index}.type`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {containerTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm text-gray-900">{field.type}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      {...form.register(`${name}.${index}.number`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="ABCD1234567"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{field.number}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingIndex === index ? (
                    <input
                      type="text"
                      {...form.register(`${name}.${index}.sealNumber`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="SL123456"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{field.sealNumber}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingIndex === index ? (
                    <input
                      type="number"
                      {...form.register(`${name}.${index}.tare`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{field.tare}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingIndex === index ? (
                    <input
                      type="number"
                      {...form.register(`${name}.${index}.vgm`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{field.vgm}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingIndex === index ? (
                    <select
                      {...form.register(`${name}.${index}.status`)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      {containerStatuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm text-gray-900">{field.status}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {editingIndex === index ? (
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => update(index, tempItem)}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(index)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {fields.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Container className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No containers added</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a container
            </p>
            <button
              type="button"
              onClick={addNewContainer}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Container
            </button>
          </div>
        )}
      </div>
    </div>
  );
}