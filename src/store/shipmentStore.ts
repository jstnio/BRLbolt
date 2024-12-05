import { create } from 'zustand';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { OceanFreightShipment, AirFreightShipment, TruckFreightShipment } from '../types';

interface ShipmentState {
  oceanShipments: OceanFreightShipment[];
  airShipments: AirFreightShipment[];
  truckShipments: TruckFreightShipment[];
  loading: boolean;
  error: string | null;
  setOceanShipments: (shipments: OceanFreightShipment[]) => void;
  setAirShipments: (shipments: AirFreightShipment[]) => void;
  setTruckShipments: (shipments: TruckFreightShipment[]) => void;
  fetchShipments: () => Promise<void>;
  addOceanShipment: (shipment: Omit<OceanFreightShipment, 'id'>) => Promise<string>;
  addAirShipment: (shipment: Omit<AirFreightShipment, 'id'>) => Promise<string>;
  addTruckShipment: (shipment: Omit<TruckFreightShipment, 'id'>) => Promise<string>;
  updateOceanShipment: (id: string, data: Partial<OceanFreightShipment>) => Promise<void>;
  updateAirShipment: (id: string, data: Partial<AirFreightShipment>) => Promise<void>;
  updateTruckShipment: (id: string, data: Partial<TruckFreightShipment>) => Promise<void>;
  deleteOceanShipment: (id: string) => Promise<void>;
  deleteAirShipment: (id: string) => Promise<void>;
  deleteTruckShipment: (id: string) => Promise<void>;
}

export const useShipmentStore = create<ShipmentState>((set, get) => ({
  oceanShipments: [],
  airShipments: [],
  truckShipments: [],
  loading: false,
  error: null,

  setOceanShipments: (oceanShipments) => set({ oceanShipments }),
  setAirShipments: (airShipments) => set({ airShipments }),
  setTruckShipments: (truckShipments) => set({ truckShipments }),

  fetchShipments: async () => {
    try {
      set({ loading: true, error: null });
      
      const oceanRef = collection(db, 'oceanShipments');
      const airRef = collection(db, 'airShipments');
      const truckRef = collection(db, 'truckShipments');
      
      const [oceanSnapshot, airSnapshot, truckSnapshot] = await Promise.all([
        getDocs(query(oceanRef, orderBy('createdAt', 'desc'))),
        getDocs(query(airRef, orderBy('createdAt', 'desc'))),
        getDocs(query(truckRef, orderBy('createdAt', 'desc')))
      ]);
      
      const oceanShipments = oceanSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as OceanFreightShipment[];
      
      const airShipments = airSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AirFreightShipment[];

      const truckShipments = truckSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TruckFreightShipment[];
      
      set({ 
        oceanShipments,
        airShipments,
        truckShipments,
        loading: false 
      });
    } catch (error: any) {
      console.error('Error fetching shipments:', error);
      set({ error: error.message, loading: false });
    }
  },

  addOceanShipment: async (shipment) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'oceanShipments'), {
        ...shipment,
        type: 'ocean',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await get().fetchShipments();
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding ocean shipment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addAirShipment: async (shipment) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'airShipments'), {
        ...shipment,
        type: 'airfreight',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await get().fetchShipments();
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding air shipment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  addTruckShipment: async (shipment) => {
    try {
      set({ loading: true, error: null });
      const docRef = await addDoc(collection(db, 'truckShipments'), {
        ...shipment,
        type: 'truck',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      await get().fetchShipments();
      return docRef.id;
    } catch (error: any) {
      console.error('Error adding truck shipment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateOceanShipment: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const shipmentRef = doc(db, 'oceanShipments', id);
      await updateDoc(shipmentRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      await get().fetchShipments();
    } catch (error: any) {
      console.error('Error updating ocean shipment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateAirShipment: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const shipmentRef = doc(db, 'airShipments', id);
      await updateDoc(shipmentRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      await get().fetchShipments();
    } catch (error: any) {
      console.error('Error updating air shipment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateTruckShipment: async (id, data) => {
    try {
      set({ loading: true, error: null });
      const shipmentRef = doc(db, 'truckShipments', id);
      await updateDoc(shipmentRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      await get().fetchShipments();
    } catch (error: any) {
      console.error('Error updating truck shipment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteOceanShipment: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'oceanShipments', id));
      await get().fetchShipments();
    } catch (error: any) {
      console.error('Error deleting ocean shipment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteAirShipment: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'airShipments', id));
      await get().fetchShipments();
    } catch (error: any) {
      console.error('Error deleting air shipment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteTruckShipment: async (id) => {
    try {
      set({ loading: true, error: null });
      await deleteDoc(doc(db, 'truckShipments', id));
      await get().fetchShipments();
    } catch (error: any) {
      console.error('Error deleting truck shipment:', error);
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));