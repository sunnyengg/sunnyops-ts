import { useState, useCallback } from 'react';
import { db } from '@/config/supabase';
import type { Challan } from '@/types/request.types';

export function useChallans(assignedSites?: string[]) {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await db.from('challans').select('*').order('date', { ascending: false });
    const filtered = assignedSites?.length
      ? (data ?? []).filter(c =>
          assignedSites.includes(c.from_site) || assignedSites.includes(c.to_site)
        )
      : (data ?? []);
    setChallans(filtered);
    setLoading(false);
  }, [assignedSites?.join(',')]);

  const save = useCallback(async (
    challan: Omit<Challan, 'id' | 'created_at'>, id?: string
  ): Promise<string | null> => {
    const { error } = id
      ? await db.from('challans').update(challan).eq('id', id)
      : await db.from('challans').insert([challan]);
    if (error) return error.message;
    await fetch();
    return null;
  }, [fetch]);

  const remove = useCallback(async (id: string): Promise<string | null> => {
    const { error } = await db.from('challans').delete().eq('id', id);
    if (error) return error.message;
    await fetch();
    return null;
  }, [fetch]);

  return { challans, loading, fetch, save, remove };
}
