import React from 'react';
import { colors, fonts } from '@/styles/tokens';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'info' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: colors.brand,     color: colors.surface,     border: `1px solid ${colors.brand}` },
  ghost:   { background: colors.slate100,  color: colors.slate600,    border: `1px solid ${colors.border}` },
  danger:  { background: colors.dangerBg,  color: colors.danger,      border: `1px solid ${colors.dangerBorder}` },
  info:    { background: colors.infoBg,    color: colors.info,        border: `1px solid ${colors.infoBorder}` },
  success: { background: colors.successBg, color: colors.success,     border: `1px solid ${colors.successBorder}` },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  style,
  ...props
}) => (
  <button
    disabled={disabled || loading}
    style={{
      ...VARIANT_STYLES[variant],
      borderRadius: 6,
      padding: '8px 16px',
      fontWeight: 700,
      fontSize: 11,
      fontFamily: fonts.mono,
      letterSpacing: 1,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.6 : 1,
      transition: 'all 0.15s',
      ...style,
    }}
    {...props}
  >
    {loading ? 'Loading...' : children}
  </button>
);
