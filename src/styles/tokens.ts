/**
 * SUNNY OPS — Design Tokens (TypeScript mirror)
 *
 * These reference the CSS custom properties defined in tokens.css.
 * Use these in inline style={{}} objects for type-safe, centralized colors.
 *
 * Usage:
 *   import { colors, fonts, radii } from '@/styles/tokens';
 *   <div style={{ color: colors.brand, fontFamily: fonts.mono }}>
 */

// ── Colors ───────────────────────────────────────────────────────────

export const colors = {
  // Brand
  brand:            'var(--color-brand)',
  brandHover:       'var(--color-brand-hover)',
  brandLight:       'var(--color-brand-light)',
  brandBorder:      'var(--color-brand-border)',

  // Slate / Neutrals
  slate50:          'var(--color-slate-50)',
  slate100:         'var(--color-slate-100)',
  slate200:         'var(--color-slate-200)',
  slate300:         'var(--color-slate-300)',
  slate400:         'var(--color-slate-400)',
  slate500:         'var(--color-slate-500)',
  slate600:         'var(--color-slate-600)',
  slate700:         'var(--color-slate-700)',
  slate800:         'var(--color-slate-800)',
  slate900:         'var(--color-slate-900)',

  // Success (Green)
  success:          'var(--color-success)',
  successDark:      'var(--color-success-dark)',
  successBg:        'var(--color-success-bg)',
  successBorder:    'var(--color-success-border)',
  successBorderMd:  'var(--color-success-border-md)',

  // Danger (Red)
  danger:           'var(--color-danger)',
  dangerBg:         'var(--color-danger-bg)',
  dangerBorder:     'var(--color-danger-border)',
  dangerBgAlt:      'var(--color-danger-bg-alt)',
  dangerBorderAlt:  'var(--color-danger-border-alt)',
  dangerBgLight:    'var(--color-danger-bg-light)',

  // Warning (Amber)
  warning:          'var(--color-warning)',
  warningDark:      'var(--color-warning-dark)',
  warningBg:        'var(--color-warning-bg)',
  warningBorder:    'var(--color-warning-border)',
  warningBorderSm:  'var(--color-warning-border-sm)',
  warningBgLight:   'var(--color-warning-bg-light)',

  // Info (Blue)
  info:             'var(--color-info)',
  infoBg:           'var(--color-info-bg)',
  infoBorder:       'var(--color-info-border)',
  infoLight:        'var(--color-info-light)',
  infoBorderLight:  'var(--color-info-border-light)',
  infoDark:         'var(--color-info-dark)',

  // Indigo / Purple
  indigo:           'var(--color-indigo)',
  indigoBg:         'var(--color-indigo-bg)',
  indigoBorder:     'var(--color-indigo-border)',
  indigoDark:       'var(--color-indigo-dark)',

  violet:           'var(--color-violet)',
  violetBg:         'var(--color-violet-bg)',
  violetBorder:     'var(--color-violet-border)',
  violetBgAlt:      'var(--color-violet-bg-alt)',
  violetBorderAlt:  'var(--color-violet-border-alt)',

  // External
  whatsapp:         'var(--color-whatsapp)',

  // Surfaces & Semantic
  surface:          'var(--color-surface)',
  pageBg:           'var(--color-page-bg)',
  headerBg:         'var(--color-header-bg)',
  border:           'var(--color-border)',
  borderLight:      'var(--color-border-light)',
  textPrimary:      'var(--color-text-primary)',
  textSecondary:    'var(--color-text-secondary)',
  textMuted:        'var(--color-text-muted)',
  textOnDark:       'var(--color-text-on-dark)',
} as const;

// ── Fonts ────────────────────────────────────────────────────────────

export const fonts = {
  mono: 'var(--font-mono)',
  sans: 'var(--font-sans)',
} as const;

// ── Radii ────────────────────────────────────────────────────────────

export const radii = {
  sm:   'var(--radius-sm)',
  md:   'var(--radius-md)',
  lg:   'var(--radius-lg)',
  xl:   'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  '3xl': 'var(--radius-3xl)',
  full: 'var(--radius-full)',
} as const;

// ── Shadows ──────────────────────────────────────────────────────────

export const shadows = {
  sm:      'var(--shadow-sm)',
  md:      'var(--shadow-md)',
  lg:      'var(--shadow-lg)',
  overlay: 'var(--shadow-overlay)',
} as const;
