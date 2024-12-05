import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { DollarSign, Receipt, FileText, CreditCard } from 'lucide-react';
import FinancialDashboard from '../components/FinancialDashboard';
import TransactionList from '../components/TransactionList';
import { Button } from '../components/Button';

export default function FinancialManagement() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'payments'>('dashboard');

  if (!user || user.role !== 'manager') {
    navigate('/');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
            <p className="mt-2 text-gray-600">
              Manage accounts receivable, payable, and financial overview
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => navigate('/financial/new-transaction')}
              className="flex items-center"
            >
              <Receipt className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/financial/reports')}
              className="flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </Button>
          </div>
        </div>

        <div className="mt-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`${
                activeTab === 'transactions'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Receipt className="h-5 w-5 mr-2" />
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`${
                activeTab === 'payments'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              Payments
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'dashboard' && <FinancialDashboard />}
        {activeTab === 'transactions' && <TransactionList />}
        {activeTab === 'payments' && <div>Payments content</div>}
      </div>
    </div>
  );
}