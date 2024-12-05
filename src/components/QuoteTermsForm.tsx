import { useFieldArray, UseFormReturn } from 'react-hook-form';
import { Plus, Trash2, FileText } from 'lucide-react';

interface Props {
  form: UseFormReturn<any>;
  name: string;
}

export default function QuoteTermsForm({ form, name }: Props) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name
  });

  const addNewTerm = () => {
    append('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Terms & Conditions
        </h3>
        <button
          type="button"
          onClick={addNewTerm}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Term
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <span className="text-gray-500">•</span>
            <input
              type="text"
              {...form.register(`${name}.${index}`)}
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter term..."
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-600 hover:text-red-900 p-2"
              title="Remove term"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No terms added</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add terms and conditions for this quote
            </p>
            <button
              type="button"
              onClick={addNewTerm}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Term
            </button>
          </div>
        )}
      </div>
    </div>
  );
}