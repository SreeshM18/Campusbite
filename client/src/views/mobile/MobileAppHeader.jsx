import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, Search, Sparkles, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const MobileAppHeader = () => {
  const { cartCount, openCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const getInitials = () => {
    if (!user || !user.name) return 'CB';
    const clean = String(user.name).trim();
    if (/^\d+$/.test(clean)) return 'ST';
    return clean
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      style={{
        padding: '1.25rem 1.25rem 0.75rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        backgroundColor: 'var(--color-canvas, #f8fafc)'
      }}
    >
      {/* Top Controls: Menu Trigger, Live Location & User Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Left Menu / Brand Icon */}
        <button
          type="button"
          onClick={() => navigate('/menu')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary, #0f172a)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex'
          }}
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>

        {/* Center Canteen Location Capsule */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'var(--surface, #ffffff)',
            border: '1px solid var(--border, #e2e8f0)',
            padding: '0.35rem 0.85rem',
            borderRadius: '100px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)'
            }}
          />
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Central Canteen
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>#3</span>
        </div>

        {/* Right User Avatar or Cart Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={openCart}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex'
            }}
            aria-label="Open Cart"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#FA4A0C',
                  color: '#ffffff',
                  fontSize: '0.64rem',
                  fontWeight: 900,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(250, 74, 12, 0.4)'
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(user ? '/profile' : '/login')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#FA4A0C',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(250, 74, 12, 0.3)'
            }}
            aria-label="Profile"
          >
            {getInitials()}
          </button>
        </div>
      </div>

      {/* Signature UI Kit Headline */}
      <div>
        <h1
          style={{
            fontSize: '2.1rem',
            fontWeight: 900,
            lineHeight: 1.15,
            color: 'var(--text-primary, #000000)',
            margin: 0,
            letterSpacing: '-0.03em'
          }}
        >
          Delicious <br />
          food for you
        </h1>
      </div>

      {/* Pill Search Bar */}
      <div
        onClick={() => navigate('/menu')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: 'var(--surface, #EFEEEE)',
          border: '1px solid var(--border, transparent)',
          borderRadius: '30px',
          padding: '0.75rem 1.25rem',
          cursor: 'pointer',
          color: 'var(--text-muted, #94a3b8)',
          fontSize: '0.92rem',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
        }}
      >
        <Search size={18} color="#64748b" />
        <span style={{ flex: 1, fontWeight: 500 }}>Search dishes, snacks & drinks...</span>
      </div>
    </div>
  );
};

export default MobileAppHeader;
