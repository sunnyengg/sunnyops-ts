import type { UserRole, PermissionKey, RolePermissions, AllRolePermissions } from '@/types/user.types';

export const ALL_ROLES: UserRole[] = [
  'staff', 'supervisor', 'inv-manager', 'fin-manager',
  'accounts', 'managing-director', 'director', 'planning_dept',
  'store-manager', 'admin',
];

export const ROLE_LABELS: Record<UserRole, string> = {
  staff:               'Staff',
  supervisor:          'Supervisor',
  'inv-manager':       'Inv. Manager (Ops)',
  'fin-manager':       'Finance Manager',
  accounts:            'Accounts (Bills Access)',
  'managing-director': 'Managing Director (Site Executive)',
  director:            'Director (Full Executive — All Sites)',
  planning_dept:       'Planning Department',
  'store-manager':     'Store Manager (Site-Restricted)',
  admin:               'Admin (User Management)',
};

export const ROLE_BADGE: Record<UserRole, { bg: string; br: string; c: string; label: string }> = {
  admin:               { bg: '#fff7ed', br: '#fed7aa', c: '#ea580c', label: 'ADMIN' },
  director:            { bg: '#fdf4ff', br: '#e9d5ff', c: '#7c3aed', label: 'DIRECTOR' },
  'managing-director': { bg: '#f0f4ff', br: '#c7d2fe', c: '#4338ca', label: 'MANAGING DIR' },
  'fin-manager':       { bg: '#eff6ff', br: '#bfdbfe', c: '#1d4ed8', label: 'FIN.MGR' },
  'inv-manager':       { bg: '#f0fdf4', br: '#bbf7d0', c: '#15803d', label: 'INV.MGR' },
  planning_dept:       { bg: '#f0fdf4', br: '#86efac', c: '#16a34a', label: 'PLANNING' },
  accounts:            { bg: '#fef3c7', br: '#fde68a', c: '#d97706', label: 'ACCOUNTS' },
  supervisor:          { bg: '#f0f9ff', br: '#bae6fd', c: '#0369a1', label: 'SUPERVISOR' },
  'store-manager':     { bg: '#fff7ed', br: '#fed7aa', c: '#ea580c', label: 'STORE MGR' },
  staff:               { bg: '#f8fafc', br: '#e2e8f0', c: '#64748b', label: 'STAFF' },
};

export const SITE_RESTRICTED_ROLES: UserRole[] = ['store-manager', 'managing-director'];

export const DEFAULT_PERMISSIONS: AllRolePermissions = {
  staff:               { dashboard: false, inventory: false, store: false, challans: false, bills: false, payables: false, requests: false, logs: false, procurement: false, hr_letters: true,  settings: false },
  supervisor:          { dashboard: true,  inventory: true,  store: true,  challans: true,  bills: false, payables: false, requests: true,  logs: true,  procurement: false, hr_letters: false, settings: false },
  'inv-manager':       { dashboard: true,  inventory: true,  store: true,  challans: true,  bills: false, payables: false, requests: true,  logs: true,  procurement: false, hr_letters: false, settings: false },
  'fin-manager':       { dashboard: true,  inventory: false, store: false, challans: false, bills: true,  payables: true,  requests: false, logs: false, procurement: true,  hr_letters: false, settings: false },
  accounts:            { dashboard: true,  inventory: false, store: false, challans: true,  bills: true,  payables: true,  requests: true,  logs: false, procurement: false, hr_letters: false, settings: false },
  'managing-director': { dashboard: true,  inventory: true,  store: true,  challans: true,  bills: true,  payables: true,  requests: true,  logs: true,  procurement: true,  hr_letters: true,  settings: false },
  director:            { dashboard: true,  inventory: true,  store: true,  challans: true,  bills: true,  payables: true,  requests: true,  logs: true,  procurement: true,  hr_letters: true,  settings: false },
  planning_dept:       { dashboard: true,  inventory: true,  store: false, challans: false, bills: false, payables: false, requests: true,  logs: false, procurement: true,  hr_letters: false, settings: false },
  'store-manager':     { dashboard: true,  inventory: false, store: true,  challans: true,  bills: false, payables: false, requests: true,  logs: true,  procurement: false, hr_letters: false, settings: false },
  admin:               { dashboard: true,  inventory: true,  store: true,  challans: true,  bills: true,  payables: true,  requests: true,  logs: true,  procurement: true,  hr_letters: true,  settings: true  },
};

export function getPermissions(role: UserRole, overrides: AllRolePermissions = {}): RolePermissions {
  const defaults = DEFAULT_PERMISSIONS[role] ?? DEFAULT_PERMISSIONS.staff!;
  const override = overrides[role];
  return override ? { ...defaults, ...override } : { ...defaults };
}

export function hasPerm(role: UserRole, perm: PermissionKey, overrides: AllRolePermissions = {}): boolean {
  if (role === 'admin') return true;
  return getPermissions(role, overrides)[perm] ?? false;
}
