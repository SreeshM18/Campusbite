import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ClipboardList, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileBottomNav = () => {
  const { cartCount, openCart } = useCart();
  const location = useLocation();

  // Don't show on staff dashboard
  if (location.pathname.startsWith('/staff')) {
    return null;
  }

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/menu', label: 'Menu', icon: UtensilsCrossed },
    { to: '/orders', label: 'Orders', icon: ClipboardList },
    { to: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        backgroundColor: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0.45rem 0.5rem 0.65rem 0.5rem',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.08)',
        backdropFilter: 'blur(10px)'
      }}
      className="mobile-bottom-nav"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              textDecoration: 'none',
              color: isActive ? 'var(--brand-primary)' : 'var(--text-muted)',
              fontSize: '0.72rem',
              fontWeight: isActive ? 800 : 500,
              flex: 1,
              padding: '0.25rem 0',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand-primary)'
                  }}
                />
              )}
            </div>
            <span>{item.label}</span>
          </NavLink>
        );
      })}

      {/* Cart Quick Tab Button */}
      <button
        type="button"
        onClick={openCart}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          background: 'none',
          border: 'none',
          color: cartCount > 0 ? 'var(--brand-primary)' : 'var(--text-muted)',
          fontSize: '0.72rem',
          fontWeight: cartCount > 0 ? 800 : 500,
          flex: 1,
          padding: '0.25rem 0',
          cursor: 'pointer'
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} strokeWidth={cartCount > 0 ? 2.5 : 2} />
          {cartCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                backgroundColor: 'var(--brand-primary)',
                color: '#ffffff',
                fontSize: '0.62rem',
                fontWeight: 800,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>
    </nav>
  );
};

export default MobileBottomNav;
