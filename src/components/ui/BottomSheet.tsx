import React from 'react';
import { colors } from '@/styles/tokens';

interface BottomSheetProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ onClose, children }) => (
  <div
    onClick={e => e.target === e.currentTarget && onClose()}
    style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.4)',
      zIndex: 600,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: colors.surface,
        borderRadius: '20px 20px 0 0',
        maxHeight: '80vh',
        overflowY: 'auto',
        paddingBottom: 'env(safe-area-inset-bottom, 16px)',
      }}
    >
      {/* Drag handle */}
      <div style={{ textAlign: 'center', padding: '10px 0 0' }}>
        <div style={{ width: 40, height: 4, background: colors.border, borderRadius: 2, margin: '0 auto' }} />
      </div>
      {children}
    </div>
  </div>
);
