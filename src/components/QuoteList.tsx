import { useNavigate } from 'react-router-dom';
import { Quote } from '../types/quote';
import { format } from 'date-fns';
import { Ship, Plane, FileText, Send, Check, X, Edit, Trash2 } from 'lucide-react';
import QuoteStatusBadge from './QuoteStatusBadge';
import { useQuoteStore } from '../store/quoteStore';
import QuoteForm from './QuoteForm';
import { useState } from 'react';
import { formatCurrency } from '../lib/utils';

interface Props {
  quotes: Quote[];
}

export default function QuoteList({ quotes }: Props) {
  const navigate = useNavigate();
  const { sendQuote, acceptQuote, rejectQuote } = useQuoteStore();
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const getQuoteIcon = (type: 'ocean' | 'air') => {
    return type === 'air' ? (
      <Plane className="h-5 w-5 text-blue-500" />
    ) : (
      <Ship className="h-5 w-5 text-blue-500" />
    );
  };

  const getLocationDisplay = (quote: Quote) => {
    if (quote.type === 'air') {
      return (
        <>
          <div className="text-sm text-gray-900">{quote.origin.name}</div>
          <div className="text-sm text-gray-900">{quote.destination.name}</div>
          <div className="text-xs text-gray-500 mt-1">
            {quote.origin.city}, {quote.origin.country} →<br />
            {quote.destination.city}, {quote.destination.country}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="text-sm text-gray-900">{quote.origin.name}</div>
          <div className="text-sm text-gray-900">{quote.destination.name}</div>
          <div className="text-xs text-gray-500 mt-1">
            {quote.origin.city}, {quote.origin.country} →<br />
            {quote.destination.city}, {quote.destination.country}
          </div>
        </>
      );
    }
  };

  const handleAction = async (action: 'send' | 'accept' | 'reject', quote: Quote) => {
    try {
      switch (action) {
        case 'send':
          await sendQuote(quote.id);
          break;
        case 'accept':
          await acceptQuote(quote.id);
          break;
        case 'reject':
          await rejectQuote(quote.id);
          break;
      }
    } catch (error) {
      console.error('Error performing quote action:', error);
    }
  };

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowEditForm(true);
  };

  return (
    <>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reference
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valid Until
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getQuoteIcon(quote.type)}
                    <span className="ml-3 text-sm font-medium text-blue-600">
                      {quote.reference}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <QuoteStatusBadge status={quote.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{quote.shipper.company}</div>
                  <div className="text-sm text-gray-500">{quote.shipper.name}</div>
                </td>
                <td className="px-6 py-4">
                  {getLocationDisplay(quote)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(quote.total, quote.currency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(quote.validity.validUntil), 'PP')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => navigate(`/quotes/${quote.id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="View Details"
                    >
                      <FileText className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleEdit(quote)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                      title="Edit Quote"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    
                    {quote.status === 'draft' && (
                      <button
                        onClick={() => handleAction('send', quote)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Send Quote"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}

                    {quote.status === 'sent' && (
                      <>
                        <button
                          onClick={() => handleAction('accept', quote)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Accept Quote"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction('reject', quote)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Reject Quote"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditForm && selectedQuote && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <QuoteForm
              quote={selectedQuote}
              onClose={() => {
                setShowEditForm(false);
                setSelectedQuote(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}