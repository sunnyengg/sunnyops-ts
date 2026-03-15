import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

/**
 * Main Supabase client — uses anon key, protected by RLS
 * This is safe to use in frontend code
 */
export const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey: 'sunnyops_auth',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

/**
 * Admin Supabase client — uses service role key
 * Only available if the user has pasted the key in Settings
 * Used ONLY for creating/deleting users (admin operations)
 */
export function getAdminClient() {
  const key =
    import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY ||
    localStorage.getItem('sunny_svc_key') ||
    '';
  if (!key) return null;
  return createClient(SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
