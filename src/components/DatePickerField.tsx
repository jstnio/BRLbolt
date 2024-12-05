import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from 'lucide-react';

interface Props {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  label: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export default function DatePickerField({
  selected,
  onChange,
  label,
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false
}: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <DatePicker
          selected={selected}
          onChange={onChange}
          dateFormat="MMM d, yyyy"
          placeholderText={placeholder}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-none text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}