import React from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'info' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: { background: '#f97316', color: '#fff',    border: '1px solid #f97316' },
  ghost:   { background: '#f1f5f9', color: '#374151', border: '1px solid #e2e8f0' },
  danger:  { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
  info:    { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' },
  success: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
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
      fontFamily: 'IBM Plex Mono, monospace',
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
