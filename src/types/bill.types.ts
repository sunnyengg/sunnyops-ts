export type BillStatus = 'Pending' | 'Partial' | 'Paid';

export interface Bill {
  id: string;
  site: string;
  bill_no: string;
  date: string;
  description: string;
  gross_amount: number;
  gst_amount: number;
  sd_amount: number;
  gst_hold: number;
  net_receivable: number;
  received_amount: number;
  wo_no?: string;
  status: BillStatus;
  remarks?: string;
  created_at: string;
  updated_at?: string;
  updated_by?: string;
}

export interface WorkOrder {
  id: string;
  wo_no: string;
  site: string;
  description: string;
  value: number;
  amendments?: WorkOrderAmendment[];
  created_at: string;
}

export interface WorkOrderAmendment {
  date: string;
  value: number;
  reason: string;
}

export interface EInvoiceLineItem {
  description: string;
  hsn_sac: string;
  qty: number;
  unit: string;
  rate: number;
  amount: number;
  gst_rate: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export interface EInvoice {
  id: string;
  invoice_no: string;
  date: string;
  site: string;
  items: EInvoiceLineItem[];
  sub_total: number;
  total_gst: number;
  grand_total: number;
  irn?: string;
  status: 'Draft' | 'Submitted' | 'Cancelled';
  created_at: string;
  created_by?: string;
}

export interface CreditDebitNote {
  id: string;
  cdn_no: string;
  type: 'Credit' | 'Debit';
  date: string;
  against_invoice?: string;
  site: string;
  amount: number;
  reason: string;
  created_at: string;
}

export interface Payable {
  id: string;
  site: string;
  vendor: string;
  bill_no?: string;
  date: string;
  description: string;
  amount: number;
  paid_amount: number;
  status: 'Pending' | 'Partial' | 'Paid';
  category: string;
  remarks?: string;
  created_at: string;
  updated_at?: string;
}

export interface BankAccount {
  name: string;
  account_no: string;
  ifsc: string;
  balance?: number;
}
