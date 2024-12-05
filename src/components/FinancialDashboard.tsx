import { useEffect } from 'react';
import { useFinancialStore } from '../store/financialStore';
import { formatCurrency } from '../lib/utils';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function FinancialDashboard() {
  const { summary, fetchSummary, loading } = useFinancialStore();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading financial summary...</p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Receivables</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(summary.totalReceivables)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payables</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(summary.totalPayables)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Receivables</p>
              <p className="text-2xl font-semibold text-red-600">
                {formatCurrency(summary.overdueReceivables)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue Payables</p>
              <p className="text-2xl font-semibold text-red-600">
                {formatCurrency(summary.overduePayables)}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Debtors & Creditors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Debtors</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {summary.topDebtors.map((debtor) => (
                <div key={debtor.entityId} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{debtor.entityName}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(debtor.amount, debtor.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Creditors</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {summary.topCreditors.map((creditor) => (
                <div key={creditor.entityId} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{creditor.entityName}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(creditor.amount, creditor.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cashflow Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Cash Flow</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {summary.cashflow.map((flow) => (
              <div key={flow.date} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{new Date(flow.date).toLocaleDateString()}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-green-600">+{formatCurrency(flow.receivables)}</span>
                  <span className="text-sm text-red-600">-{formatCurrency(flow.payables)}</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(flow.balance)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}