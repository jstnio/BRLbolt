import { BaseEntity } from './common';

export interface ContactPerson {
  name: string;
  position: string;
  email: string;
  phone: string;
  mobile: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface Airport extends BaseEntity {
  code: string;
  city: string;
  terminals: string[];
  type: 'international' | 'domestic';
  contacts: ContactPerson[];
}

export interface Port extends BaseEntity {
  code: string;
  city: string;
  terminals: string[];
  type: 'seaport' | 'river';
  contacts: ContactPerson[];
}

export interface Customer extends BaseEntity {
  type: 'shipper' | 'consignee' | 'both';
  taxId: string;
  address: Address;
  website: string;
  industry: string;
  contacts: ContactPerson[];
  creditTerms: string;
  paymentTerms: string;
  notes: string;
}

export interface ShippingLine extends BaseEntity {
  office: string;
  phone: string;
  accountExecutive: ContactPerson;
  notes: string;
}

export interface FreightForwarder extends BaseEntity {
  office: string;
  phone: string;
  personnel: {
    directors: ContactPerson[];
    managers: ContactPerson[];
    accounting: ContactPerson[];
    operations: ContactPerson[];
  };
  notes: string;
}