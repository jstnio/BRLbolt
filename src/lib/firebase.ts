import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDjwJ1V5qbTviK5Fny-jDBziToS0uaLGIE",
  authDomain: "geometric-ivy-709.firebaseapp.com",
  projectId: "geometric-ivy-709",
  storageBucket: "geometric-ivy-709.firebasestorage.app",
  messagingSenderId: "632720753298",
  appId: "1:632720753298:web:8bb45745bb8d59bdde5c4b",
  measurementId: "G-QX3NQ26WHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Collection references
export const collections = {
  users: 'users',
  oceanShipments: 'oceanShipments',
  airShipments: 'airShipments',
  truckShipments: 'truckShipments',
  quotes: 'quotes',
  customers: 'customers',
  shippingLines: 'shippingLines',
  freightForwarders: 'freightForwarders',
  airports: 'airports',
  airlines: 'airlines',
  ports: 'ports',
  terminals: 'terminals',
  customsBrokers: 'customsBrokers',
  truckers: 'truckers'
};

// Query functions
export const getAllOceanShipments = () => {
  return query(
    collection(db, collections.oceanShipments),
    orderBy('createdAt', 'desc')
  );
};

export const getAllAirShipments = () => {
  return query(
    collection(db, collections.airShipments),
    orderBy('createdAt', 'desc')
  );
};

export const getAllTruckShipments = () => {
  return query(
    collection(db, collections.truckShipments),
    orderBy('createdAt', 'desc')
  );
};

export const getCustomerShipments = (userId: string) => {
  return {
    ocean: query(
      collection(db, collections.oceanShipments),
      where('shipper.userId', '==', userId),
      orderBy('createdAt', 'desc')
    ),
    air: query(
      collection(db, collections.airShipments),
      where('shipper.userId', '==', userId),
      orderBy('createdAt', 'desc')
    ),
    truck: query(
      collection(db, collections.truckShipments),
      where('shipper.userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
  };
};

export const searchShipments = async (searchTerm: string) => {
  try {
    // Search in ocean shipments
    const oceanQuery = query(
      collection(db, collections.oceanShipments),
      where('blNumber', '==', searchTerm.toUpperCase())
    );

    // Search in air shipments
    const airQuery = query(
      collection(db, collections.airShipments),
      where('awbNumber', '==', searchTerm.toUpperCase())
    );

    // Search in truck shipments
    const truckQuery = query(
      collection(db, collections.truckShipments),
      where('crtNumber', '==', searchTerm.toUpperCase())
    );

    // Execute all queries in parallel
    const [oceanDocs, airDocs, truckDocs] = await Promise.all([
      getDocs(oceanQuery),
      getDocs(airQuery),
      getDocs(truckQuery)
    ]);

    // Combine results
    const results = [
      ...oceanDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...airDocs.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...truckDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ];

    return results;
  } catch (error) {
    console.error('Error searching shipments:', error);
    throw error;
  }
};