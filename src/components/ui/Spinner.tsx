import React from 'react';
import { colors, fonts } from '@/styles/tokens';

export const Spinner: React.FC = () => (
  <div style={{
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    padding: 40, color: colors.textMuted, fontSize: 12,
    fontFamily: fonts.mono,
  }}>
    Loading...
  </div>
);
