export type ItemCondition = 'Good' | 'Fair' | 'Poor' | 'Condemned';
export type StockMovementType = 'IN' | 'OUT' | 'Transfer';

export interface InventoryItem {
  id: string;
  name: string;
  alias?: string;
  serial_no?: string;
  category: string;
  site: string;
  qty: number;
  min_qty: number;
  unit: string;
  condition: ItemCondition;
  purchased_from?: string;
  purchase_date?: string;
  expiry_date?: string;
  tpi_cert_no?: string;
  tpi_expiry?: string;
  created_at: string;
  updated_at?: string;
  updated_by?: string;
}

export interface StockMovement {
  id: string;
  item_id: string;
  item_name: string;
  type: StockMovementType;
  qty: number;
  site?: string;
  from_site?: string;
  to_site?: string;
  reason?: string;
  moved_by: string;
  moved_at: string;
}
