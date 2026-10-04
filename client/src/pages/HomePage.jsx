import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { menuApi } from '../services/api';
import { FoodCard } from '../components/menu/FoodCard';
import {
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  Zap,
  Award,
  ChevronRight,
  Flame,
  Coffee,
  Utensils,
  CheckCircle2,
  Store
} from 'lucide-react';

import { initialMenuItems } from '../data/fallbackMenu';

export const HomePage = () => {
  const [featuredItems, setFeaturedItems] = useState(() => initialMenuItems.filter((i) => i.featured).slice(0, 4));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await menuApi.getMenu({ featured: true });
        const items = res.data || res.menuItems || res.items || (Array.isArray(res) ? res : []);
        if (Array.isArray(items) && items.length > 0) {
          setFeaturedItems(items.slice(0, 4));
        } else {
          setFeaturedItems(initialMenuItems.filter((i) => i.featured).slice(0, 4));
        }
      } catch (err) {
        console.warn('Failed to load featured items:', err);
        setFeaturedItems(initialMenuItems.filter((i) => i.featured).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '4rem' }}>
      
      {/* Contextual Status Bar */}
      <div className="container" style={{ marginTop: '1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.65rem 1.25rem',
            backgroundColor: 'var(--surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xs)',
            fontSize: '0.88rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--veg-color)',
                boxShadow: '0 0 0 3px rgba(46, 125, 50, 0.2)'
              }}
            />
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              Central Canteen Open
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--text-secondary)' }}>07:30 AM – 07:30 PM</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Store size={15} color="var(--brand-primary)" /> Express Counter #3 Active
            </span>
            <span style={{ display: 'none' }} className="status-prep-time">
              ⚡ Avg Prep: ~10-15m
            </span>
          </div>
        </div>
      </div>

      {/* Editorial Hero Banner */}
      <section
        style={{
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          backgroundColor: 'var(--surface-dark)',
          color: '#ffffff',
          minHeight: '480px',
          display: 'flex',
          alignItems: 'center'
        }}
        className="container"
      >
        {/* Background Image with Dark Vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url('/images/back2.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.32
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, #131722 0%, rgba(19, 23, 34, 0.88) 55%, rgba(19, 23, 34, 0.4) 100%)'
          }}
        />

        {/* Hero Content */}
        <div style={{ position: 'relative', zIndex: 10, padding: '3.5rem 2.5rem', maxWidth: '680px' }}>
          
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(230, 81, 0, 0.25)',
              border: '1px solid rgba(230, 81, 0, 0.4)',
              color: 'var(--accent)',
              fontSize: '0.85rem',
              fontWeight: 700,
              padding: '0.35rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              marginBottom: '1.25rem'
            }}
          >
            <Sparkles size={15} /> Smart College Dining
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}
          >
            Skip the Lunch Queue. <br />
            <span style={{ color: 'var(--brand-primary)', textShadow: '0 2px 14px rgba(230,81,0,0.45)' }}>
              Pre-Order & Grab Fast.
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#d1d5db',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '540px'
            }}
          >
            Order freshly cooked hot meals, biryanis, dosas, and cold brews from the campus canteen in seconds. Pick up at Express Counter #3 with your digital token.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <Link to="/menu" className="btn btn-primary btn-lg">
              Explore Canteen Menu <ArrowRight size={19} />
            </Link>
            <Link to="/orders" className="btn btn-secondary btn-lg" style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}>
              Track Active Token
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights: Why CampusBite */}
      <section className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}
        >
          <div
            className="card"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--brand-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)'
              }}
            >
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Zero Waiting in Lines</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Order during lecture breaks and arrive at Counter #3 right when your order status turns <strong>Ready</strong>.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--veg-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--veg-color)'
              }}
            >
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Flexible Pickup Scheduling</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Choose Immediate (~10m), 15m, 30m, 45m, or 1h slots. The kitchen plans cooking to ensure your food is piping hot.
            </p>
          </div>

          <div
            className="card"
            style={{
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)'
              }}
            >
              <Award size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Verified Digital Tokens</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Receive an instantaneous <strong>CB-XXXX</strong> token ticket on your screen for seamless handover at pickup.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Campus Specialties Section */}
      <section className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '1.75rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Flame size={16} /> Campus Favorites
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Popular Dishes Today</h2>
          </div>
          <Link to="/menu" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: 'var(--brand-primary)', fontSize: '0.95rem' }}>
            View Full Menu <ChevronRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Loading delicious dishes...
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {featuredItems.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* 4-Step How It Works Banner */}
      <section
        style={{
          backgroundColor: 'var(--surface-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          border: '1px solid var(--border)'
        }}
        className="container"
      >
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.65rem' }}>
            How CampusBite Works in 4 Steps
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Designed for students, faculty, and canteen staff to make break-time dining effortless.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}
        >
          <div>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-primary)',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.35rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: 'var(--shadow-warm)'
              }}
            >
              01
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Select Food</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Browse real-time menu items, veg/non-veg tags, and prep times.
            </p>
          </div>

          <div>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--brand-secondary)',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.35rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              02
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Choose Timing</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Select instant prep or schedule ahead for your upcoming class break.
            </p>
          </div>

          <div>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.35rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              03
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Get CB-Token</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Instant server-generated digital token generated with live kitchen updates.
            </p>
          </div>

          <div>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--veg-color)',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '1.35rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}
            >
              04
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Grab & Go</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Flash token at Counter #3 express desk and pick up your warm meal.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 640px) {
          .status-prep-time { display: inline !important; }
        }
      `}</style>

    </div>
  );
};
