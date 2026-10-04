import React from 'react';
import { Link } from 'react-router-dom';

const TABS = [
  { id: 'all', label: 'Foods' },
  { id: 'Beverages', label: 'Drinks' },
  { id: 'Fast Food', label: 'Snacks' },
  { id: 'South Indian', label: 'South Special' },
  { id: 'Healthy', label: 'Diet Bowls' },
  { id: 'Desserts', label: 'Desserts' }
];

export const MobileCategoryTabs = ({ activeTab = 'all', onSelectTab }) => {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '0.25rem',
          borderBottom: '1px solid var(--border, #e2e8f0)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab && onSelectTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem 0.25rem 0.75rem 0.25rem',
                fontSize: '0.98rem',
                fontWeight: isActive ? 800 : 500,
                color: isActive ? '#FA4A0C' : 'var(--text-muted, #94a3b8)',
                cursor: 'pointer',
                position: 'relative',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s ease',
                flexShrink: 0
              }}
            >
              {tab.label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    right: 0,
                    height: '3px',
                    borderRadius: '3px 3px 0 0',
                    backgroundColor: '#FA4A0C',
                    boxShadow: '0 2px 8px rgba(250, 74, 12, 0.4)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCategoryTabs;
