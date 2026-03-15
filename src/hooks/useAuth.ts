import { useState, useEffect, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { db } from '@/config/supabase';
import { parseAssignedSites } from '@/utils/formatters';
import { saveBiometricSession, getBiometricSession, verifyBiometric } from '@/utils/biometric';
import { DEFAULT_PERMISSIONS } from '@/config/roles';
import type { UserRole, AllRolePermissions } from '@/types/user.types';

export interface AuthState {
  user: User | null;
  userName: string;
  userRole: UserRole;
  assignedSites: string[];
  rolePerms: AllRolePermissions;
  loading: boolean;
}

export interface AuthActions {
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  biometricSignIn: () => Promise<string | null>;
}

export function useAuth(): AuthState & AuthActions {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('staff');
  const [assignedSites, setAssignedSites] = useState<string[]>([]);
  const [rolePerms, setRolePerms] = useState<AllRolePermissions>(DEFAULT_PERMISSIONS);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u: User) => {
    const { data: profile } = await db.from('profiles').select('*').eq('id', u.id).single();
    if (profile) {
      setUserName(profile.full_name || profile.name || u.email || '');
      setUserRole((profile.role as UserRole) || 'staff');
      setAssignedSites(parseAssignedSites(profile.assigned_sites));
    }
    const { data: settings } = await db.from('app_settings').select('value').eq('key', 'role_permissions').single();
    if (settings?.value) {
      setRolePerms({ ...DEFAULT_PERMISSIONS, ...(settings.value as AllRolePermissions) });
    }
  }, []);

  useEffect(() => {
    db.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadProfile(session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
    const { data: { subscription } } = db.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); loadProfile(session.user); }
      else { setUser(null); setUserName(''); setUserRole('staff'); setAssignedSites([]); }
    });
    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    const { data, error } = await db.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (data.session) {
      saveBiometricSession(data.session.access_token, data.session.refresh_token, email);
    }
    await db.from('login_history').insert([{ user_id: data.user.id, user_name: email, email, logged_in_at: new Date().toISOString() }]);
    return null;
  }, []);

  const signOut = useCallback(async () => {
    if (user) {
      await db.from('login_history').update({ logged_out_at: new Date().toISOString() }).eq('user_id', user.id).is('logged_out_at', null);
    }
    localStorage.removeItem('sunnyops_auth');
    await db.auth.signOut();
  }, [user]);

  const biometricSignIn = useCallback(async (): Promise<string | null> => {
    const cred = await verifyBiometric();
    if (!cred) return 'Biometric verification failed';
    const cached = getBiometricSession();
    if (!cached) return 'Session expired — please sign in with password once';
    const { error } = await db.auth.setSession({ access_token: cached.access_token, refresh_token: cached.refresh_token });
    if (error) return 'Session expired — please sign in with password once';
    return null;
  }, []);

  return { user, userName, userRole, assignedSites, rolePerms, loading, signIn, signOut, biometricSignIn };
}
