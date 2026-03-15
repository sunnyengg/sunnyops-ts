import React from 'react';

export interface TabDef {
  key: string;
  label: string;
  icon: string;
}

interface BottomNavProps {
  tabs: TabDef[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ tabs, activeTab, onTabChange }) => (
  <div style={{
    position: 'fixed', bottom: 0, left: 0, right: 0,
    background: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    zIndex: 100,
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  }}>
    {tabs.slice(0, 5).map(({ key, label, icon }) => (
      <button
        key={key}
        onClick={() => onTabChange(key)}
        style={{
          flex: 1, padding: '8px 0',
          border: 'none', background: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}
      >
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{
          fontFamily: 'IBM Plex Mono, monospace',
          fontSize: 8, letterSpacing: 0.5,
          color: activeTab === key ? '#f97316' : '#71717a',
          fontWeight: activeTab === key ? 700 : 400,
          textTransform: 'uppercase',
        }}>
          {label}
        </span>
      </button>
    ))}
  </div>
);
