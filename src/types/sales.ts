export interface PhoneModel {
  id: string;
  name: string;
  price?: number;
  count?: number;
}

export interface SalesData {
  id?: string;
  shop: string;
  salesTotal: number;
  serviceTotal: number;
  keypadPhones: number;
  smartphones: number;
  keypadModels: PhoneModel[];
  smartphoneModels: PhoneModel[];
  timestamp: string;
  date: string;
}

export interface SalesState {
  salesData: SalesData[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface SalesFormData {
  date: any;
  shop: string;
  salesTotal: string;
  serviceTotal: string;
  keypadPhones: number;
  smartphones: number;
  keypadModels: PhoneModel[];
  smartphoneModels: PhoneModel[];
}
