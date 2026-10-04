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

  // Extract user initials or role acronym for phone numbers
  const getInitials = (name, role) => {
    if (!name) return 'CB';
    const clean = String(name).trim();
    if (/^\d+$/.test(clean)) {
      return role === 'FACULTY' ? 'FA' : role === 'CANTEEN_STAFF' ? 'STF' : 'ST';
    }
    return clean
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky-header">
      <div className="container" style={{ width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none', flexShrink: 0 }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: 'var(--shadow-warm)'
              }}
            >
              <UtensilsCrossed size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  lineHeight: 1.1
                }}
              >
                Campus<span style={{ color: 'var(--brand-primary)' }}>Bite</span>
              </span>
              <span className="brand-subtitle" style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: '-2px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            
            {/* Cart Trigger Button */}
            {!isStaff && (
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="btn btn-outline"
                style={{
                  position: 'relative',
                  padding: '0.45rem 0.8rem',
                  minHeight: '38px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
                aria-label="Open food cart"
              >
                <ShoppingBag size={18} color="var(--color-brand-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Tray</span>
                {itemCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: 'var(--brand-primary)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      width: '20px',
                      height: '20px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Avatar Initials Badge */}
                <Link
                  to={isStaff ? '/staff/orders' : '/profile'}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: isStaff ? '#2563eb' : 'var(--brand-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    boxShadow: 'var(--shadow-xs)',
                    textDecoration: 'none',
                    flexShrink: 0
                  }}
                  title={`${user.name} (${user.role}) - View Profile`}
                >
                  {getInitials(user.name, user.role)}
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
                  className="btn btn-ghost btn-sm desktop-logout-btn"
                  title="Sign Out"
                  style={{ display: 'none', color: 'var(--text-secondary)', padding: '0.35rem 0.65rem', minHeight: '38px', alignItems: 'center', gap: '0.35rem' }}
                >
                  <LogOut size={16} />
                  <span className="logout-text">Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'none', alignItems: 'center', gap: '0.5rem' }} className="desktop-auth-btns">
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
            {!user && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline btn-block"
                  style={{ minHeight: '44px', justifyContent: 'center' }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary btn-block"
                  style={{ minHeight: '44px', justifyContent: 'center' }}
                >
                  Create Account
                </Link>
              </div>
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
          .desktop-auth-btns { display: flex !important; }
          .desktop-logout-btn { display: flex !important; }
          .user-badge-text { display: flex !important; }
          .logout-text { display: inline !important; }
        }
        @media (max-width: 767px) {
          .mobile-menu-btn { display: flex !important; }
          .brand-subtitle { display: none !important; }
        }
      `}</style>
    </header>
  );
};
