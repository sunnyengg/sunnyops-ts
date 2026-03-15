export const ADMIN_EMAIL = 'john@sunnyengg.com';
export const APP_VERSION = 'v2.0.0-ts';

export const COMPANY = {
  name: 'P. Sunny Engineering Contractors (OPC) Pvt. Ltd.',
  gstin: '29AAOCP5225B1ZE',
  address: 'Door No 1-144 A30, Shree Siddi Vinayaka Building',
  city: 'Mangaluru',
  state: 'Karnataka',
  state_code: '29',
  pincode: '575030',
  phone: '08246637172 / 8050196063',
  email: 'sunny@sunnyengg.com',
} as const;

export interface SiteDetail {
  name: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  state_code: string;
}

export const DEFAULT_SITE_DETAILS: SiteDetail[] = [
  { name: 'MRPL',         gstin: '29AAACM5132A1ZZ', address: 'Kutherthoor',    city: 'Mangalore',  state: 'Karnataka',     pincode: '575030', state_code: '29' },
  { name: 'MEIL',         gstin: '09AABCL2313B1Z6', address: 'Anpara',         city: 'Sonebhadra', state: 'Uttar Pradesh', pincode: '231225', state_code: '09' },
  { name: 'UPCL',         gstin: '',                address: 'Yelluru Padubidri', city: 'Udupi',   state: 'Karnataka',     pincode: '574113', state_code: '29' },
  { name: 'BTPS-Bellary', gstin: '29AAACK8032D1ZQ', address: 'Kudithini',      city: 'Bellary',    state: 'Karnataka',     pincode: '583152', state_code: '29' },
  { name: 'Moxi',         gstin: '33AARCM7295H1ZV', address: 'Melamaruthur',   city: '',           state: 'Tamil Nadu',    pincode: '628105', state_code: '33' },
  { name: 'GAIL',         gstin: '',                address: '',               city: '',           state: '',              pincode: '',       state_code: ''   },
  { name: 'Head Office',  gstin: '29AAOCP5225B1ZE', address: 'Door No 1-144 A30, Shree Siddi Vinayaka Building', city: 'Mangaluru', state: 'Karnataka', pincode: '575030', state_code: '29' },
];

export const INVENTORY_CATEGORIES = [
  'PPE', 'Power Tools', 'Hand Tools', 'Lifting & Rigging',
  'Measuring Instruments', 'Safety Equipment', 'Electrical',
  'Welding Equipment', 'Civil Equipment', 'Vehicles', 'Others',
] as const;

export const STORE_CATEGORIES = [
  'PPE', 'Electrical', 'Civil', 'Welding Consumables',
  'Hardware', 'Plumbing', 'Safety', 'Stationery', 'Others',
] as const;

export const UNITS = ['Nos', 'Set', 'Pair', 'Kg', 'Ltr', 'Mtr', 'Roll', 'Box', 'Pack'] as const;

export const CONDITIONS = ['Good', 'Fair', 'Poor', 'Condemned'] as const;

export const RECRUITMENT_STAGES = [
  'Screening', 'Interview', 'Offer Sent', 'Joined', 'Not Selected',
] as const;

export const STAGE_COLOURS: Record<string, { bg: string; c: string; br: string }> = {
  'Screening':    { bg: '#eff6ff', c: '#1d4ed8', br: '#bfdbfe' },
  'Interview':    { bg: '#fffbeb', c: '#92400e', br: '#fcd34d' },
  'Offer Sent':   { bg: '#f0fdf4', c: '#15803d', br: '#bbf7d0' },
  'Joined':       { bg: '#f5f3ff', c: '#6d28d9', br: '#ddd6fe' },
  'Not Selected': { bg: '#fef2f2', c: '#dc2626', br: '#fecaca' },
};

export const PAYABLE_CATEGORIES = [
  'Labour', 'Material', 'Equipment', 'Transport',
  'Professional Services', 'Utilities', 'Others',
] as const;

// GST rates commonly used
export const GST_RATES = [0, 5, 12, 18, 28] as const;

// Our company state code for GST intra/inter state detection
export const OUR_STATE_CODE = '29'; // Karnataka
