import { CargoItem, Location } from './index';

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type QuoteType = 'ocean' | 'air';

interface QuoteParty {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
}

interface QuoteCost {
  description: string;
  amount: number;
  currency: string;
  unit?: string;
  quantity?: number;
}

interface QuoteValidity {
  issuedDate: string;
  validUntil: string;
}

export interface Quote {
  id: string;
  type: QuoteType;
  reference: string;
  status: QuoteStatus;
  shipper: QuoteParty;
  consignee: QuoteParty;
  origin: Location;
  destination: Location;
  cargoDetails: CargoItem[];
  costs: QuoteCost[];
  subtotal: number;
  taxes: number;
  total: number;
  currency: string;
  validity: QuoteValidity;
  terms: string[];
  notes: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
}