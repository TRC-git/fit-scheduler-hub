export interface BusinessLocationUpdate {
  business_name?: string;
  phone_number?: string;
  tax_id?: string;
  address?: string;
  logo_url?: string;
  latitude?: number;
  longitude?: number;
}

export interface BusinessLocation {
  locationid: number;
  business_name: string | null;
  phone_number: string | null;
  tax_id: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
}