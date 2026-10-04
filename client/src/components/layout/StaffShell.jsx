import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  ChefHat,
  Clock,
  LogOut,
  UtensilsCrossed,
  Activity,
  CheckCircle2,
  Menu,
  X,
  Layers
} from 'lucide-react';

export const StaffShell = ({ children, activeCount = 0, onRefresh, refreshing = false }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/staff/orders', label: 'Live Kitchen Queue', icon: Activity },
    { to: '/staff/menu', label: 'Menu & Stock Control', icon: UtensilsCrossed }
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f1f5f9', // Clean neutral slate operational background
        color: '#0f172a'
      }}
    >
      {/* 1. Staff Operational Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 900,
          backgroundColor: '#0f172a', // Dark slate command bar
          color: '#f8fafc',
          borderBottom: '1px solid #1e293b',
          padding: '0.75rem 1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          {/* Brand & Canteen Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              to="/staff/orders"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                textDecoration: 'none',
                color: '#ffffff'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <ChefHat size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <strong style={{ fontSize: '1.05rem', letterSpacing: '-0.02em' }}>CampusBite</strong>
                  <span
                    style={{
                      backgroundColor: '#e65100',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    KITCHEN
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                  <span>Central Food Court • Counter #3</span>
                </div>
              </div>
            </Link>

            {/* Live Queue Counter Pill */}
            <div
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#1e293b',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: activeCount > 0 ? '#fbbf24' : '#94a3b8'
              }}
              className="staff-queue-pill"
            >
              <Activity size={14} />
              <span>{activeCount} Active in Queue</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            className="staff-desktop-nav"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.86rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : '#94a3b8',
                    backgroundColor: isActive ? '#1e293b' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Clock, Staff Profile & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Realtime Clock */}
            <div
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                color: '#cbd5e1',
                backgroundColor: '#1e293b',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)'
              }}
              className="staff-clock"
            >
              <Clock size={14} color="#f59e0b" />
              <span>
                {currentTime.toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                })}
              </span>
            </div>

            {/* Staff Profile Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.82rem'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div style={{ display: 'none' }} className="staff-user-name">
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', display: 'block', lineHeight: 1.2 }}>
                  {user?.name || 'Staff User'}
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {user?.role || 'CANTEEN_STAFF'}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-ghost btn-sm"
              style={{
                color: '#ef4444',
                padding: '0.35rem 0.6rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
              aria-label="Logout staff session"
            >
              <LogOut size={15} />
              <span style={{ display: 'none' }} className="staff-logout-text">Logout</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-ghost btn-sm staff-mobile-toggle"
              style={{ color: '#ffffff', display: 'flex' }}
              aria-label="Toggle kitchen navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem 0 0.5rem',
              borderTop: '1px solid #1e293b',
              marginTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : '#94a3b8',
                    backgroundColor: isActive ? '#1e293b' : 'transparent',
                    textDecoration: 'none'
                  }}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* 2. Main Operational Work Area */}
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '1600px',
          margin: '0 auto',
          padding: '1.25rem'
        }}
      >
        {children}
      </main>

      <style>{`
        @media (min-width: 768px) {
          .staff-desktop-nav { display: flex !important; }
          .staff-queue-pill { display: flex !important; }
          .staff-clock { display: flex !important; }
          .staff-user-name { display: block !important; }
          .staff-logout-text { display: inline !important; }
          .staff-mobile-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
};
