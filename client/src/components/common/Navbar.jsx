import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  UtensilsCrossed,
  ShoppingBag,
  Clock,
  LayoutDashboard,
  LogOut,
  User,
  Menu as MenuIcon,
  X,
  ChefHat
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isStaff } = useAuth();
  const { itemCount, setIsCartDrawerOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Extract user initials
  const getInitials = (name) => {
    if (!name) return 'CB';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky-header">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: 'var(--shadow-warm)'
              }}
            >
              <UtensilsCrossed size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                Campus<span style={{ color: 'var(--brand-primary)' }}>Bite</span>
              </span>
              <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '-4px' }}>
                Smart Canteen Pre-Order
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '1.75rem' }} className="desktop-nav">
            <Link
              to="/menu"
              style={{
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive('/menu') ? 'var(--brand-primary)' : 'var(--text-secondary)',
                transition: 'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              Menu
            </Link>

            {user && !isStaff && (
              <>
                <Link
                  to="/orders"
                  style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: isActive('/orders') ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Clock size={16} /> My Orders
                </Link>
                <Link
                  to="/profile"
                  style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: isActive('/profile') ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <User size={16} /> Profile
                </Link>
              </>
            )}

            {isStaff && (
              <>
                <Link
                  to="/staff/orders"
                  style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: isActive('/staff/orders') ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <LayoutDashboard size={16} /> Kitchen Queue
                </Link>
                <Link
                  to="/staff/menu"
                  style={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: isActive('/staff/menu') ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    transition: 'color 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <ChefHat size={16} /> Manage Menu
                </Link>
              </>
            )}
          </nav>

          {/* Action Area: Cart & Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
            {/* Cart Trigger Button */}
            {!isStaff && (
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="btn btn-outline"
                style={{
                  position: 'relative',
                  padding: '0.55rem 0.95rem',
                  minHeight: '44px',
                  borderRadius: 'var(--radius-md)'
                }}
                aria-label="Open food cart"
              >
                <ShoppingBag size={19} color="var(--color-brand-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Tray</span>
                {itemCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: 'var(--brand-primary)',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
            )}

            {/* User Session Affordance */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {/* Avatar Initials Badge */}
                <Link
                  to={isStaff ? '/staff/orders' : '/profile'}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: isStaff ? '#2563eb' : 'var(--brand-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    boxShadow: 'var(--shadow-xs)',
                    textDecoration: 'none'
                  }}
                  title={`${user.name} (${user.role}) - View Profile`}
                >
                  {getInitials(user.name)}
                </Link>

                <Link
                  to={isStaff ? '/staff/orders' : '/profile'}
                  style={{
                    display: 'none',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    marginRight: '0.2rem',
                    textDecoration: 'none'
                  }}
                  className="user-badge-text"
                >
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                    {user.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: isStaff ? '#2563eb' : 'var(--text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                  title="Sign Out"
                  style={{ color: 'var(--text-secondary)', padding: '0.35rem 0.65rem', minHeight: '40px' }}
                >
                  <LogOut size={17} />
                  <span style={{ display: 'none' }} className="logout-text">Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-ghost btn-sm" style={{ minHeight: '40px' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" style={{ minHeight: '40px' }}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                width: '44px',
                height: '44px',
                padding: '0.4rem',
                color: 'var(--text-primary)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'transparent',
                border: 'none'
              }}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem 0 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <Link
              to="/menu"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, padding: '0.65rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}
            >
              Browse Menu
            </Link>
            {user && !isStaff && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontWeight: 600, padding: '0.65rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}
                >
                  My Orders & History
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontWeight: 600, padding: '0.65rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}
                >
                  Profile & Security
                </Link>
              </>
            )}
            {isStaff && (
              <>
                <Link
                  to="/staff/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontWeight: 600, padding: '0.65rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', color: 'var(--brand-primary)' }}
                >
                  Kitchen Orders Queue
                </Link>
                <Link
                  to="/staff/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontWeight: 600, padding: '0.65rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', color: 'var(--brand-primary)' }}
                >
                  Menu Management
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ fontWeight: 600, padding: '0.65rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', color: 'var(--text-primary)' }}
                >
                  Staff Profile & Security
                </Link>
              </>
            )}
            {user && (
              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '0 0.5rem' }}>Signed in as <strong>{user.name}</strong> ({user.role})</p>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  style={{ color: 'var(--nonveg-color)', fontWeight: 600, marginTop: '0.5rem', padding: '0.65rem 0.5rem', minHeight: '44px', display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', textAlign: 'left' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .user-badge-text { display: flex !important; }
          .logout-text { display: inline !important; }
        }
        @media (max-width: 767px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
};
