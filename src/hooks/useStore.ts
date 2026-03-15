import { useState, useCallback } from 'react';
import { db } from '@/config/supabase';
import type { StoreItem, StoreIssue } from '@/types/store.types';

export function useStore(assignedSites?: string[]) {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [issues, setIssues] = useState<StoreIssue[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    let q = db.from('store_items').select('*').order('name');
    if (assignedSites?.length) q = q.in('site', assignedSites);
    const { data: itemData } = await q;

    let qi = db.from('store_issues').select('*').order('issued_at', { ascending: false });
    if (assignedSites?.length) qi = qi.in('site', assignedSites);
    const { data: issueData } = await qi;

    setItems(itemData ?? []);
    setIssues(issueData ?? []);
    setLoading(false);
  }, [assignedSites?.join(',')]);

  const saveItem = useCallback(async (
    item: Omit<StoreItem, 'id' | 'created_at'>, id?: string
  ): Promise<string | null> => {
    const payload = { ...item, updated_at: new Date().toISOString() };
    const { error } = id
      ? await db.from('store_items').update(payload).eq('id', id)
      : await db.from('store_items').insert([payload]);
    if (error) return error.message;
    await fetch();
    return null;
  }, [fetch]);

  const issueItem = useCallback(async (
    issue: Omit<StoreIssue, 'id'>
  ): Promise<string | null> => {
    const { error: issueErr } = await db.from('store_issues').insert([issue]);
    if (issueErr) return issueErr.message;
    // Deduct from stock
    const item = items.find(i => i.id === issue.item_id);
    if (item) {
      await db.from('store_items')
        .update({ qty: item.qty - issue.qty, updated_at: new Date().toISOString() })
        .eq('id', issue.item_id);
    }
    await fetch();
    return null;
  }, [items, fetch]);

  return { items, issues, loading, fetch, saveItem, issueItem };
}
