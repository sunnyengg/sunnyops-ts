export type UserRole =
  | 'admin'
  | 'director'
  | 'managing-director'
  | 'fin-manager'
  | 'accounts'
  | 'inv-manager'
  | 'planning_dept'
  | 'supervisor'
  | 'store-manager'
  | 'staff';

export type PermissionKey =
  | 'dashboard'
  | 'inventory'
  | 'store'
  | 'challans'
  | 'bills'
  | 'payables'
  | 'requests'
  | 'logs'
  | 'procurement'
  | 'hr_letters'
  | 'settings';

export type RolePermissions = Record<PermissionKey, boolean>;
export type AllRolePermissions = Partial<Record<UserRole, RolePermissions>>;

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  name?: string;
  designation?: string;
  role: UserRole;
  assigned_sites: string[];
  created_at?: string;
  updated_at?: string;
  last_sign_in_at?: string;
}

export interface LoginHistoryEntry {
  id: string;
  user_id: string;
  user_name: string;
  email: string;
  logged_in_at: string;
  logged_out_at?: string;
}

export interface AuditLogEntry {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  changed_by: string;
  changed_at: string;
}
