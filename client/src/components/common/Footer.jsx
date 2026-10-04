import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Clock, MapPin, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--surface-dark)',
        color: '#d1d5db',
        marginTop: 'auto',
        borderTop: '1px solid #2d3345',
        padding: '3.5rem 0 2rem'
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <UtensilsCrossed size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                Campus<span style={{ color: 'var(--brand-primary)' }}>Bite</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              The official smart canteen pre-ordering platform. Skip long lunch queues, schedule meal pickups, and enjoy freshly cooked food on time.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>
              <ShieldCheck size={16} color="var(--accent)" />
              <span>Campus Hygiene Certified Daily</span>
            </div>
          </div>

          {/* Canteen Hours & Pickup Counter */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.2rem', fontFamily: 'var(--font-display)' }}>
              Canteen Operational Hours
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <Clock size={18} color="var(--brand-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#ffffff', display: 'block' }}>Breakfast & Snacks</strong>
                  <span style={{ color: '#9ca3af' }}>07:30 AM — 11:30 AM</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <Clock size={18} color="var(--brand-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#ffffff', display: 'block' }}>Lunch & Hot Meals</strong>
                  <span style={{ color: '#9ca3af' }}>12:00 PM — 03:30 PM</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <Clock size={18} color="var(--brand-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#ffffff', display: 'block' }}>Evening Refreshments</strong>
                  <span style={{ color: '#9ca3af' }}>04:00 PM — 07:30 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.2rem', fontFamily: 'var(--font-display)' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link to="/menu" style={{ color: '#9ca3af', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Full Food Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" style={{ color: '#9ca3af', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Track Order with Token
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: '#9ca3af', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Student & Faculty Portal
                </Link>
              </li>
              <li>
                <Link to="/staff/orders" style={{ color: '#9ca3af', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Canteen Staff Command
                </Link>
              </li>
              <li>
                <Link to="/design-system" style={{ color: '#9ca3af', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                  Design System Lab
                </Link>
              </li>
            </ul>
          </div>

          {/* Counter Location */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.2rem', fontFamily: 'var(--font-display)' }}>
              Express Pickup Counter
            </h4>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#9ca3af', marginBottom: '1rem' }}>
              <MapPin size={20} color="var(--brand-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#ffffff', display: 'block' }}>Central Food Court — Counter #3</strong>
                Ground Floor, Student Amenities Complex, Main Campus
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              * Simply present your active <strong>CB-XXXX Token</strong> on your phone screen at Counter #3 for zero-wait handover.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #2d3345',
            paddingTop: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#6b7280'
          }}
        >
          <div>
            © {new Date().getFullYear()} CampusBite. Engineered for College Dining Excellence.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built with <Heart size={14} color="var(--brand-primary)" fill="var(--brand-primary)" /> for students and faculty.
          </div>
        </div>
      </div>
    </footer>
  );
};
