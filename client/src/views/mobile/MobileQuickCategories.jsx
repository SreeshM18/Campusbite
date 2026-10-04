import React from 'react';
import {
  Sparkles,
  Utensils,
  Flame,
  Pizza,
  Coffee,
  Cake,
  Salad
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: Sparkles, color: '#f59e0b' },
  { id: 'South Indian', name: 'South Indian', icon: Utensils, color: '#10b981' },
  { id: 'North Indian', name: 'North Indian', icon: Flame, color: '#ef4444' },
  { id: 'Fast Food', name: 'Fast Food', icon: Pizza, color: '#f97316' },
  { id: 'Beverages', name: 'Drinks', icon: Coffee, color: '#8b5cf6' },
  { id: 'Desserts', name: 'Sweets', icon: Cake, color: '#ec4899' },
  { id: 'Healthy', name: 'Diet Bowl', icon: Salad, color: '#22c55e' }
];

export const MobileQuickCategories = ({ activeCategory, onSelectCategory }) => {
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}
      >
        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
          Categories
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700 }}>
          Swipe for more →
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.85rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0,
                width: '68px'
              }}
            >
              {/* Circular Avatar */}
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--surface)',
                  color: isActive ? '#ffffff' : cat.color,
                  border: `2px solid ${isActive ? 'var(--brand-primary)' : 'var(--border)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? '0 6px 14px rgba(255, 107, 0, 0.35)' : 'var(--shadow-xs)',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={22} />
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '68px'
                }}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileQuickCategories;
