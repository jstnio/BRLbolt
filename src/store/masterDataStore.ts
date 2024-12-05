import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BaseEntity } from '../types/common';

interface MasterDataState {
  entities: Record<string, BaseEntity[]>;
  loading: boolean;
  error: string | null;
  setEntities: (collectionName: string, entities: BaseEntity[]) => void;
  fetchEntities: (collectionName: string) => Promise<void>;
  addEntity: (collectionName: string, entity: Omit<BaseEntity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateEntity: (collectionName: string, id: string, data: Partial<BaseEntity>) => Promise<void>;
  deleteEntity: (collectionName: string, id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMasterDataStore = create<MasterDataState>((set, get) => ({
  entities: {},
  loading: false,
  error: null,

  setEntities: (collectionName, entities) => 
    set(state => ({
      entities: {
        ...state.entities,
        [collectionName]: entities
      }
    })),

  fetchEntities: async (collectionName) => {
    try {
      set({ loading: true, error: null });
      const q = query(
        collection(db, collectionName),
        orderBy('name', 'asc')
      );
      const snapshot = await getDocs(q);
      const entities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BaseEntity[];
      
      set(state => ({
        entities: {
          ...state.entities,
          [collectionName]: entities
        }
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error(`Error fetching ${collectionName}:`, error);
    } finally {
      set({ loading: false });
    }
  },

  addEntity: async (collectionName, entity) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, collectionName), {
        ...entity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await get().fetchEntities(collectionName);
      return docRef.id;
    } catch (error: any) {
      set({ error: error.message });
      console.error(`Error adding ${collectionName}:`, error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateEntity: async (collectionName, id, data) => {
    try {
      set({ loading: true, error: null });
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      await get().fetchEntities(collectionName);
    } catch (error: any) {
      set({ error: error.message });
      console.error(`Error updating ${collectionName}:`, error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteEntity: async (collectionName, id) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, collectionName, id));
      
      set(state => ({
        entities: {
          ...state.entities,
          [collectionName]: state.entities[collectionName]?.filter(entity => entity.id !== id) || []
        }
      }));
    } catch (error: any) {
      set({ error: error.message });
      console.error(`Error deleting ${collectionName}:`, error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));