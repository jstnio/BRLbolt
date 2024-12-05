import { useNavigate } from 'react-router-dom';
import QuoteForm from '../components/QuoteForm';

export default function NewQuote() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-none">
        <QuoteForm onClose={() => navigate('/quotes')} />
      </div>
    </div>
  );
}