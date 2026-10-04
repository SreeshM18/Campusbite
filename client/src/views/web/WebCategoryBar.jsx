import React from 'react';
import { Link } from 'react-router-dom';
import {
  Utensils,
  Coffee,
  Flame,
  Salad,
  Pizza,
  Sandwich,
  Cake,
  Sparkles,
  ChevronRight
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Dishes', icon: Sparkles, count: 114, color: '#f59e0b' },
  { id: 'South Indian', name: 'South Indian', icon: Utensils, count: 18, color: '#10b981' },
  { id: 'North Indian', name: 'North Indian', icon: Flame, count: 24, color: '#ef4444' },
  { id: 'Fast Food', name: 'Fast Food', icon: Pizza, count: 28, color: '#f97316' },
  { id: 'Beverages', name: 'Beverages', icon: Coffee, count: 16, color: '#8b5cf6' },
  { id: 'Desserts', name: 'Desserts', icon: Cake, count: 14, color: '#ec4899' },
  { id: 'Healthy', name: 'Healthy & Diet', icon: Salad, count: 14, color: '#22c55e' }
];

export const WebCategoryBar = ({ activeCategory, onSelectCategory }) => {
  return (
    <section style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--brand-primary)',
              marginBottom: '0.25rem'
            }}
          >
            Explore Categories
          </div>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.02em'
            }}
          >
            What are you craving today?
          </h2>
        </div>

        <Link
          to="/menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.92rem',
            fontWeight: 700,
            color: 'var(--brand-primary)',
            textDecoration: 'none'
          }}
        >
          View Full Menu (114 Items) <ChevronRight size={16} />
        </Link>
      </div>

      {/* Grid of category cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem'
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
                justifyContent: 'center',
                gap: '0.65rem',
                padding: '1.25rem 0.85rem',
                backgroundColor: isActive ? 'var(--brand-primary)' : 'var(--surface)',
                color: isActive ? '#ffffff' : 'var(--text-primary)',
                border: `1px solid ${isActive ? 'var(--brand-primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-xl, 20px)',
                boxShadow: isActive ? '0 12px 24px rgba(255, 107, 0, 0.25)' : 'var(--shadow-xs)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'var(--brand-primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                }
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : `${cat.color}15`,
                  color: isActive ? '#ffffff' : cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={22} />
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', lineHeight: 1.2 }}>
                  {cat.name}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: isActive ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-muted)',
                    marginTop: '0.2rem',
                    fontWeight: 600
                  }}
                >
                  {cat.count} Dishes
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default WebCategoryBar;
