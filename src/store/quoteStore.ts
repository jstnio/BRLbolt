import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Quote } from '../types/quote';

interface QuoteState {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  setQuotes: (quotes: Quote[]) => void;
  fetchQuotes: () => Promise<void>;
  addQuote: (quote: Omit<Quote, 'id'>) => Promise<string>;
  updateQuote: (id: string, data: Partial<Quote>) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  sendQuote: (id: string) => Promise<void>;
  acceptQuote: (id: string) => Promise<void>;
  rejectQuote: (id: string) => Promise<void>;
}

export const useQuoteStore = create<QuoteState>((set, get) => ({
  quotes: [],
  loading: false,
  error: null,

  setQuotes: (quotes) => set({ quotes }),

  fetchQuotes: async () => {
    try {
      set({ loading: true, error: null });
      const quotesRef = collection(db, 'quotes');
      const q = query(quotesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const quotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Quote[];
      
      set({ quotes, loading: false });
    } catch (error: any) {
      console.error('Error fetching quotes:', error);
      set({ error: error.message, loading: false });
    }
  },

  addQuote: async (quote) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'quotes'), {
        ...quote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await get().fetchQuotes();
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding quote:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateQuote: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const quoteRef = doc(db, 'quotes', id);
      await updateDoc(quoteRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      await get().fetchQuotes();
    } catch (error: any) {
      console.error('Error updating quote:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteQuote: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'quotes', id));
      await get().fetchQuotes();
    } catch (error: any) {
      console.error('Error deleting quote:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  sendQuote: async (id) => {
    try {
      set({ loading: true, error: null });
      const quoteRef = doc(db, 'quotes', id);
      await updateDoc(quoteRef, {
        status: 'sent',
        sentAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await get().fetchQuotes();
    } catch (error: any) {
      console.error('Error sending quote:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  acceptQuote: async (id) => {
    try {
      set({ loading: true, error: null });
      const quoteRef = doc(db, 'quotes', id);
      await updateDoc(quoteRef, {
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await get().fetchQuotes();
    } catch (error: any) {
      console.error('Error accepting quote:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  rejectQuote: async (id) => {
    try {
      set({ loading: true, error: null });
      const quoteRef = doc(db, 'quotes', id);
      await updateDoc(quoteRef, {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await get().fetchQuotes();
    } catch (error: any) {
      console.error('Error rejecting quote:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));