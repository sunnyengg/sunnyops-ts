import { useState, useCallback } from 'react';
import { db } from '@/config/supabase';
import type { InventoryItem } from '@/types/inventory.types';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await db.from('inventory').select('*').order('name');
    setItems(data ?? []);
    setLoading(false);
  }, []);

  const save = useCallback(async (
    item: Omit<InventoryItem, 'id' | 'created_at'>,
    id?: string
  ): Promise<string | null> => {
    const payload = { ...item, updated_at: new Date().toISOString() };
    const { error } = id
      ? await db.from('inventory').update(payload).eq('id', id)
      : await db.from('inventory').insert([payload]);
    if (error) return error.message;
    await fetch();
    return null;
  }, [fetch]);

  const remove = useCallback(async (id: string): Promise<string | null> => {
    const { error } = await db.from('inventory').delete().eq('id', id);
    if (error) return error.message;
    await fetch();
    return null;
  }, [fetch]);

  const updateStock = useCallback(async (
    id: string, qty: number, uName: string
  ): Promise<string | null> => {
    const { error } = await db.from('inventory')
      .update({ qty, updated_at: new Date().toISOString(), updated_by: uName })
      .eq('id', id);
    if (error) return error.message;
    await fetch();
    return null;
  }, [fetch]);

  return { items, loading, fetch, save, remove, updateStock };
}
