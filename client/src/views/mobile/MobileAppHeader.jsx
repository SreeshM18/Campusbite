import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Bell, Search, ShoppingBag, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MobileAppHeader = () => {
  const { cartCount, openCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0.85rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      {/* Top Row: Location & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Campus Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 107, 0, 0.12)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <MapPin size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Campus Central Canteen
              </span>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981'
                }}
              />
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Express Counter #3 • Open 07:30 AM
            </div>
          </div>
        </div>

        {/* Right Actions: Cart & Notifications */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={openCart}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-canvas)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)'
            }}
            aria-label="Open Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--brand-primary)',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(255, 107, 0, 0.4)'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search Input Trigger */}
      <div
        onClick={() => navigate('/menu')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          backgroundColor: 'var(--color-canvas)',
          border: '1px solid var(--border)',
          borderRadius: '100px',
          padding: '0.65rem 1rem',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          fontSize: '0.88rem'
        }}
      >
        <Search size={16} color="var(--brand-primary)" />
        <span style={{ flex: 1 }}>Search dishes (e.g. Masala Dosa, Biryani, Pizza)...</span>
        <span
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            backgroundColor: 'rgba(255, 107, 0, 0.1)',
            color: 'var(--brand-primary)',
            padding: '0.15rem 0.5rem',
            borderRadius: '100px'
          }}
        >
          114 Items
        </span>
      </div>
    </div>
  );
};

export default MobileAppHeader;
