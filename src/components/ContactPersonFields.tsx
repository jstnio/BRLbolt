import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  form: UseFormReturn<any>;
  fieldArrayName: string;
  title: string;
}

export default function ContactPersonFields({ form, fieldArrayName, title }: Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: fieldArrayName,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={() => append({ name: '', position: '', email: '', phone: '', mobile: '' })}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Contact
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">Contact {index + 1}</h4>
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                {...form.register(`${fieldArrayName}.${index}.name`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                {...form.register(`${fieldArrayName}.${index}.position`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...form.register(`${fieldArrayName}.${index}.email`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                {...form.register(`${fieldArrayName}.${index}.phone`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile</label>
              <input
                type="tel"
                {...form.register(`${fieldArrayName}.${index}.mobile`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <p className="text-sm text-gray-500 italic">No contacts added yet</p>
      )}
    </div>
  );
}