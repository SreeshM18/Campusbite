import React from 'react';
import { Link } from 'react-router-dom';
import { FoodCard } from '../../components/menu/FoodCard';
import { Flame, Sparkles, ArrowRight } from 'lucide-react';

export const WebFeaturedDishes = ({ dishes = [], loading = false }) => {
  return (
    <section style={{ width: '100%' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#f59e0b',
              marginBottom: '0.35rem'
            }}
          >
            <Flame size={16} fill="#f59e0b" /> Campus Student Favorites
          </div>
          <h2
            style={{
              fontSize: '1.85rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.02em'
            }}
          >
            Trending & Chef Specials
          </h2>
        </div>

        <Link
          to="/menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '0.65rem 1.25rem',
            borderRadius: '100px',
            color: 'var(--text-primary)',
            fontWeight: 700,
            fontSize: '0.9rem',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--brand-primary)';
            e.currentTarget.style.color = 'var(--brand-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          Explore All Dishes <ArrowRight size={16} />
        </Link>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.75rem'
        }}
      >
        {dishes.slice(0, 8).map((dish) => (
          <FoodCard key={dish._id || dish.id} item={dish} />
        ))}
      </div>
    </section>
  );
};

export default WebFeaturedDishes;
