export type RequestType = 'mobilization' | 'demobilization' | 'material';
export type RequestStatus =
  | 'Pending'
  | 'Approved'
  | 'With Director'
  | 'Completed'
  | 'Rejected';

export interface RequestItem {
  item_id?: string;
  item_name: string;
  qty: number;
  unit?: string;
  remarks?: string;
}

export interface SiteRequest {
  id: string;
  type: RequestType;
  requesting_site: string;
  status: RequestStatus;
  raised_by: string;
  raised_at: string;
  items: RequestItem[];
  remarks?: string;
  approved_by?: string;
  approved_at?: string;
  mob_refs?: string[];
}

export interface Challan {
  id: string;
  challan_no: string;
  date: string;
  from_site: string;
  to_site: string;
  vehicle_no?: string;
  items: ChallanItem[];
  remarks?: string;
  ewb_no?: string;
  ewb_date?: string;
  ewb_valid_till?: string;
  issued_by_name?: string;
  created_at: string;
}

export interface ChallanItem {
  name: string;
  qty: number;
  unit?: string;
  serial_no?: string;
}
