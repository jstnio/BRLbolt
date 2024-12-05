export type TransactionType = 'payable' | 'receivable';
export type TransactionStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'credit_card' | 'check' | 'cash' | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  referenceNumber: string;
  description: string;
  amount: number;
  currency: string;
  exchangeRate?: number;
  dueDate: string;
  issueDate: string;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  entity: {
    id: string;
    type: 'customer' | 'vendor' | 'agent';
    name: string;
    document?: string;
  };
  relatedDocuments?: {
    type: 'invoice' | 'quote' | 'shipment' | 'other';
    id: string;
    number: string;
  }[];
  notes?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }[];
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  exchangeRate?: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  notes?: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }[];
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface FinancialSummary {
  totalReceivables: number;
  totalPayables: number;
  overdueReceivables: number;
  overduePayables: number;
  cashflow: {
    date: string;
    receivables: number;
    payables: number;
    balance: number;
  }[];
  topDebtors: {
    entityId: string;
    entityName: string;
    amount: number;
    currency: string;
  }[];
  topCreditors: {
    entityId: string;
    entityName: string;
    amount: number;
    currency: string;
  }[];
}