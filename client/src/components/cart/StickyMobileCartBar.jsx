import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const StickyMobileCartBar = () => {
  const { cartItems, itemCount, subtotal, setIsCartDrawerOpen } = useCart();
  const { isStaff } = useAuth();
  const location = useLocation();

  // Hide on cart, checkout, staff pages, or when cart is empty
  if (
    isStaff ||
    itemCount === 0 ||
    location.pathname === '/cart' ||
    location.pathname === '/checkout' ||
    location.pathname.startsWith('/staff')
  ) {
    return null;
  }

  return (
    <div className="sticky-mobile-cart-bar">
      <div className="container">
          <button
          onClick={() => setIsCartDrawerOpen(true)}
          style={{
            width: '100%',
            minHeight: '48px',
            backgroundColor: 'var(--brand-primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-warm)',
            border: 'none',
            cursor: 'pointer'
          }}
          aria-label="View food tray"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem'
              }}
            >
              {itemCount}
            </div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.9 }}>
                Food Tray
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>
                ₹{subtotal}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}>
            <span>View Tray</span>
            <ArrowRight size={18} />
          </div>
        </button>
      </div>

      <style>{`
        .sticky-mobile-cart-bar {
          position: fixed;
          bottom: calc(0.85rem + env(safe-area-inset-bottom, 0px));
          left: 0;
          right: 0;
          padding-left: env(safe-area-inset-left, 0px);
          padding-right: env(safe-area-inset-right, 0px);
          z-index: 40;
          display: block;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (min-width: 768px) {
          .sticky-mobile-cart-bar {
            display: none;
          }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
