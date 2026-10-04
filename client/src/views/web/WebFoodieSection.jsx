import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MobileFloatingCard } from '../mobile/MobileFloatingCard';
import { Sparkles, ArrowRight } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All Foods' },
  { id: 'South Indian', label: 'South Special' },
  { id: 'North Indian', label: 'North Indian' },
  { id: 'Fast Food', label: 'Snacks & Burgers' },
  { id: 'Beverages', label: 'Cold & Hot Drinks' },
  { id: 'Healthy', label: 'Diet & Salads' }
];

export const WebFoodieSection = ({ dishes = [] }) => {
  const [activeTab, setActiveTab] = useState('all');

  const filtered =
    activeTab === 'all'
      ? dishes
      : dishes.filter(
          (d) =>
            d.category?.toLowerCase() === activeTab.toLowerCase() ||
            (activeTab === 'Healthy' && (d.dietary === 'veg' || d.category === 'Healthy'))
        );

  const displayDishes = filtered.slice(0, 8);

  return (
    <section style={{ width: '100%' }}>
      {/* Header & Category Switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1.25rem'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#FA4A0C',
              fontSize: '0.85rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.35rem'
            }}
          >
            <Sparkles size={16} /> Foodie App Signature Showcase
          </div>
          <h2
            style={{
              fontSize: '2.1rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.02em'
            }}
          >
            Delicious Food For Everyone
          </h2>
        </div>

        {/* Tab Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--surface)',
            padding: '0.35rem',
            borderRadius: '100px',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xs)',
            flexWrap: 'wrap'
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  backgroundColor: isActive ? '#FA4A0C' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: 'none',
                  borderRadius: '100px',
                  padding: '0.45rem 1rem',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(250, 74, 12, 0.35)' : 'none'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Elevated Floating Plate Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '1.75rem',
          paddingTop: '1rem'
        }}
      >
        {displayDishes.map((dish) => (
          <MobileFloatingCard key={dish._id || dish.id} dish={dish} />
        ))}
      </div>

      {/* View Full Menu CTA */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link
          to="/menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            backgroundColor: 'var(--surface)',
            border: '2px solid #FA4A0C',
            color: '#FA4A0C',
            fontWeight: 800,
            fontSize: '1rem',
            padding: '0.85rem 2rem',
            borderRadius: '100px',
            textDecoration: 'none',
            boxShadow: '0 6px 20px rgba(250, 74, 12, 0.15)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FA4A0C';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface)';
            e.currentTarget.style.color = '#FA4A0C';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Explore All 114 Dishes in Menu <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
};

export default WebFoodieSection;
