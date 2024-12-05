import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { Quote } from '../types/quote';
import { format } from 'date-fns';
import { Ship, Plane, Calendar, MapPin, User, Edit, Clock, Trash2, FileText, Send, Check, X } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import QuotePDF from '../components/QuotePDF';
import QuoteForm from '../components/QuoteForm';
import DeleteQuoteModal from '../components/DeleteQuoteModal';
import QuoteStatusBadge from '../components/QuoteStatusBadge';
import { useQuoteStore } from '../store/quoteStore';
import { formatCurrency, formatNumber } from '../lib/utils';

export default function QuoteDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sendQuote, acceptQuote, rejectQuote } = useQuoteStore();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const quoteDoc = await getDoc(doc(db, 'quotes', id));
        
        if (quoteDoc.exists()) {
          setQuote({ 
            id: quoteDoc.id, 
            ...quoteDoc.data() 
          } as Quote);
        } else {
          setError('Quote not found');
        }
      } catch (error) {
        console.error('Error fetching quote:', error);
        setError('Error loading quote details');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id]);

  const handleAction = async (action: 'send' | 'accept' | 'reject') => {
    if (!quote) return;
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
      // Refresh quote data
      const updatedDoc = await getDoc(doc(db, 'quotes', quote.id));
      setQuote({ id: updatedDoc.id, ...updatedDoc.data() } as Quote);
    } catch (error) {
      console.error('Error performing quote action:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quote details...</p>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{error}</h3>
          <div className="mt-6">
            <button
              onClick={() => navigate('/quotes')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {quote.type === 'air' ? (
                <Plane className="h-8 w-8 text-white mr-3" />
              ) : (
                <Ship className="h-8 w-8 text-white mr-3" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {quote.reference}
                </h1>
                <p className="text-blue-100">
                  {quote.type === 'air' ? 'Air Freight' : 'Ocean Freight'} Quote
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <QuoteStatusBadge status={quote.status} />
              <PDFDownloadLink
                document={<QuotePDF quote={quote} />}
                fileName={`${quote.reference}.pdf`}
                className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </PDFDownloadLink>
              {user?.role === 'manager' && (
                <>
                  <button
                    onClick={() => setShowEditForm(true)}
                    className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <QuoteStatusBadge status={quote.status} />
                  <div className="flex space-x-2">
                    {quote.status === 'draft' && user?.role === 'manager' && (
                      <button
                        onClick={() => handleAction('send')}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send Quote
                      </button>
                    )}
                    {quote.status === 'sent' && (
                      <>
                        <button
                          onClick={() => handleAction('accept')}
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction('reject')}
                          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Created: {format(new Date(quote.createdAt), 'PPp')}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Valid Until: {format(new Date(quote.validity.validUntil), 'PP')}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parties</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Shipper</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-900">{quote.shipper.company}</p>
                    <p className="text-sm text-gray-600">{quote.shipper.name}</p>
                    <p className="text-sm text-gray-600">{quote.shipper.email}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Consignee</h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-900">{quote.consignee.company}</p>
                    <p className="text-sm text-gray-600">{quote.consignee.name}</p>
                    <p className="text-sm text-gray-600">{quote.consignee.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Route</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Origin</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {quote.origin.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {quote.origin.city}, {quote.origin.country}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Destination</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {quote.destination.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {quote.destination.city}, {quote.destination.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cargo Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pieces</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quote.cargoDetails.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.pieces}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(item.grossWeight)} kg</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatNumber(item.volume)} m³</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Costs</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quote.costs.map((cost, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cost.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cost.unit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cost.quantity || 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(cost.amount, quote.currency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(Number(cost.amount) * (cost.quantity || 1), quote.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">Subtotal</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(quote.subtotal, quote.currency)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">Taxes</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(quote.taxes, quote.currency)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-right text-sm font-medium text-gray-900">Total</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(quote.total, quote.currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Terms & Conditions</h3>
                <ul className="list-disc list-inside space-y-2">
                  {quote.terms.map((term, index) => (
                    <li key={index} className="text-sm text-gray-600">{term}</li>
                  ))}
                </ul>
              </div>

              {quote.notes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Notes</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{quote.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <QuoteForm
              quote={quote}
              onClose={() => setShowEditForm(false)}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteQuoteModal
          quoteId={quote.id}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}