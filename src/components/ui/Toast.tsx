import React, { useEffect } from 'react';
import { colors, fonts } from '@/styles/tokens';

interface ToastProps {
  message: string;
  type?: 'ok' | 'err';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'ok', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const isErr = type === 'err';
  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 1000,
      background: isErr ? colors.dangerBg : colors.successBg,
      border: `1px solid ${isErr ? colors.dangerBorder : colors.successBorder}`,
      color: isErr ? colors.danger : colors.success,
      borderRadius: 8, padding: '12px 20px',
      fontFamily: fonts.mono, fontSize: 12, fontWeight: 700,
      boxShadow: '0 4px 12px rgba(0,0,0,.1)',
      maxWidth: 320,
    }}>
      {message}
    </div>
  );
};
