import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction, PaymentRecord, FinancialSummary } from '../types/financial';

interface FinancialState {
  transactions: Transaction[];
  payments: PaymentRecord[];
  summary: FinancialSummary | null;
  loading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  fetchPayments: (transactionId?: string) => Promise<void>;
  fetchSummary: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<string>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addPayment: (payment: Omit<PaymentRecord, 'id'>) => Promise<string>;
  updatePayment: (id: string, data: Partial<PaymentRecord>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
}

export const useFinancialStore = create<FinancialState>((set, get) => ({
  transactions: [],
  payments: [],
  summary: null,
  loading: false,
  error: null,

  fetchTransactions: async () => {
    try {
      set({ loading: true, error: null });
      const transactionsRef = collection(db, 'transactions');
      const q = query(transactionsRef, orderBy('dueDate', 'desc'));
      const snapshot = await getDocs(q);
      
      const transactions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      
      set({ transactions, loading: false });
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchPayments: async (transactionId?: string) => {
    try {
      set({ loading: true, error: null });
      const paymentsRef = collection(db, 'payments');
      const q = transactionId
        ? query(paymentsRef, where('transactionId', '==', transactionId), orderBy('paymentDate', 'desc'))
        : query(paymentsRef, orderBy('paymentDate', 'desc'));
      
      const snapshot = await getDocs(q);
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentRecord[];
      
      set({ payments, loading: false });
    } catch (error: any) {
      console.error('Error fetching payments:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchSummary: async () => {
    try {
      set({ loading: true, error: null });
      const summaryRef = doc(db, 'financialSummary', 'current');
      const summaryDoc = await getDocs(collection(db, 'financialSummary'));
      
      if (summaryDoc.docs.length > 0) {
        const summary = {
          id: summaryDoc.docs[0].id,
          ...summaryDoc.docs[0].data()
        } as FinancialSummary;
        set({ summary, loading: false });
      }
    } catch (error: any) {
      console.error('Error fetching financial summary:', error);
      set({ error: error.message, loading: false });
    }
  },

  addTransaction: async (transaction) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transaction,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await get().fetchTransactions();
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateTransaction: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const transactionRef = doc(db, 'transactions', id);
      await updateDoc(transactionRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      await get().fetchTransactions();
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteTransaction: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'transactions', id));
      await get().fetchTransactions();
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addPayment: async (payment) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'payments'), {
        ...payment,
        createdAt: new Date().toISOString(),
      });
      await get().fetchPayments();
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding payment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updatePayment: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const paymentRef = doc(db, 'payments', id);
      await updateDoc(paymentRef, data);
      await get().fetchPayments();
    } catch (error: any) {
      console.error('Error updating payment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deletePayment: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'payments', id));
      await get().fetchPayments();
    } catch (error: any) {
      console.error('Error deleting payment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));