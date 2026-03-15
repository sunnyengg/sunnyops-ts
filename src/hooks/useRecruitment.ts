import { useState, useCallback } from 'react';
import { db } from '@/config/supabase';
import type { Applicant, RecruitmentStage } from '@/types/hr.types';

export function useRecruitment() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await db
      .from('applicants')
      .select('*')
      .order('created_at', { ascending: false });
    setApplicants(data ?? []);
    setLoading(false);
  }, []);

  const save = useCallback(async (
    applicant: Omit<Applicant, 'id' | 'created_at'>,
    id?: string
  ): Promise<string | null> => {
    const payload = { ...applicant, updated_at: new Date().toISOString() };
    const { error } = id
      ? await db.from('applicants').update(payload).eq('id', id)
      : await db.from('applicants').insert([payload]);
    if (error) return error.message;
    await fetch();
    return null;
  }, [fetch]);

  const moveStage = useCallback(async (
    id: string,
    stage: RecruitmentStage,
    updatedBy: string
  ): Promise<string | null> => {
    const { error } = await db
      .from('applicants')
      .update({ stage, updated_at: new Date().toISOString(), updated_by: updatedBy })
      .eq('id', id);
    if (error) return error.message;
    await fetch();
    return null;
  }, [fetch]);

  const stats = {
    screening:  applicants.filter(a => a.stage === 'Screening').length,
    interview:  applicants.filter(a => a.stage === 'Interview').length,
    offered:    applicants.filter(a => a.stage === 'Offer Sent').length,
    joined:     applicants.filter(a => a.stage === 'Joined').length,
  };

  return { applicants, loading, stats, fetch, save, moveStage };
}
