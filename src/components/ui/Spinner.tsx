import React from 'react';

export const Spinner: React.FC = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
    <div style={{
      width: 32, height: 32,
      border: '3px solid #e2e8f0',
      borderTopColor: '#f97316',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);
