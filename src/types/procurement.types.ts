export type POStatus = 'Draft' | 'Approved' | 'Received' | 'Cancelled';

export interface POLineItem {
  description: string;
  hsn_sac?: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
  gst_rate: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export interface PurchaseOrder {
  id: string;
  po_no: string;
  date: string;
  site: string;
  vendor_name: string;
  vendor_gstin?: string;
  vendor_address?: string;
  items: POLineItem[];
  sub_total: number;
  total_gst: number;
  grand_total: number;
  status: POStatus;
  terms?: string;
  created_by: string;
  created_at: string;
}

export interface QuotationItem {
  description: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface Quotation {
  id: string;
  ref_no: string;
  date: string;
  client: string;
  site: string;
  subject: string;
  items: QuotationItem[];
  total: number;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  created_at: string;
}
