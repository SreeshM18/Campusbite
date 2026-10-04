import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Tag, Clock } from 'lucide-react';

const BANNERS = [
  {
    id: 1,
    title: '50% OFF First Meal',
    subtitle: 'Code: WELCOME50 • Min ₹120',
    tag: 'STUDENT SPECIAL',
    bgColor: 'linear-gradient(135deg, #0F8A3C 0%, #065F26 100%)',
    image: '/images/gourmet_hero_plate.jpg',
    cta: 'Order Now'
  },
  {
    id: 2,
    title: 'Hot South Indian Feast',
    subtitle: 'Crispy Dosa, Ghee Idli & Vada',
    tag: 'FRESH MORNING',
    bgColor: 'linear-gradient(135deg, #FF6B00 0%, #C2410C 100%)',
    image: '/images/masala_dosa.jpg',
    cta: 'Explore'
  },
  {
    id: 3,
    title: 'Hostel Thali Pass',
    subtitle: 'Full Meal for ₹80 daily',
    tag: 'BEST VALUE',
    bgColor: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)',
    image: '/images/south_indian_thali.jpg',
    cta: 'View Thalis'
  }
];

export const MobileHeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentSlide];

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div
        style={{
          background: banner.bgColor,
          borderRadius: 'var(--radius-xl, 20px)',
          padding: '1.5rem',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 12px 28px -6px rgba(0,0,0,0.25)',
          minHeight: '160px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Left Content */}
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '62%' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              padding: '0.2rem 0.6rem',
              borderRadius: '100px',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '0.5rem'
            }}
          >
            <Sparkles size={11} /> {banner.tag}
          </div>

          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 0.35rem 0'
            }}
          >
            {banner.title}
          </h3>

          <p
            style={{
              fontSize: '0.78rem',
              margin: '0 0 0.85rem 0',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 500
            }}
          >
            {banner.subtitle}
          </p>

          <Link
            to="/menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              fontWeight: 800,
              fontSize: '0.78rem',
              padding: '0.45rem 0.95rem',
              borderRadius: '100px',
              textDecoration: 'none',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)'
            }}
          >
            {banner.cta} <ArrowRight size={13} />
          </Link>
        </div>

        {/* Right Food Visual */}
        <div
          style={{
            width: '95px',
            height: '95px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
            flexShrink: 0
          }}
        >
          <img
            src={banner.image}
            alt={banner.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Slide Indicators */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '0.75rem'
        }}
      >
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: idx === currentSlide ? '20px' : '6px',
              height: '6px',
              borderRadius: '100px',
              backgroundColor: idx === currentSlide ? 'var(--brand-primary)' : 'var(--border)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileHeroBanner;
