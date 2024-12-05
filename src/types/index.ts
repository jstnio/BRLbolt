export type UserRole = 'customer' | 'manager';
export type ShipmentType = 'ocean' | 'airfreight' | 'truck';
export type ShipmentStatus = 'booked' | 'in-transit' | 'arrived' | 'delayed';

export interface User {
  uid: string;
  email: string;
  name: string;
  company: string;
  role: UserRole;
  phone?: string;
  position?: string;
  settings?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    language: string;
    timezone: string;
    twoFactorAuth: boolean;
  };
}

export interface BaseShipment {
  id: string;
  type: ShipmentType;
  status: ShipmentStatus;
  brlReference: string;
  shipperReference: string;
  consigneeReference: string;
  agentReference: string;
  shipper: any;
  consignee: any;
  agent: any;
  origin: {
    city: string;
    country: string;
  };
  destination: {
    city: string;
    country: string;
  };
  schedule: {
    estimatedDeparture: string;
    actualDeparture?: string;
    estimatedArrival: string;
    actualArrival?: string;
  };
  cargoDetails: any[];
  specialInstructions?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  trackingHistory: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  status: ShipmentStatus;
  description: string;
  location?: string;
}

export interface TruckFreightShipment extends BaseShipment {
  crtNumber: string;
  trucker: any;
  vehicle: {
    type: string;
    plateNumber: string;
    driver: {
      name: string;
      phone: string;
      license: string;
    };
  };
  route: {
    pickupAddress: string;
    deliveryAddress: string;
    estimatedDistance: number;
    waypoints?: string[];
  };
  loadDetails: {
    weight: number;
    volume: number;
    pallets: number;
    loadingType: 'side' | 'rear' | 'top';
    unloadingType: 'side' | 'rear' | 'top';
    loadingEquipment?: string[];
    unloadingEquipment?: string[];
  };
}

export type Shipment = OceanFreightShipment | AirFreightShipment | TruckFreightShipment;