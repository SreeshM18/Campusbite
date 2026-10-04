import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Clock,
  Phone,
  Play,
  Star,
  ShieldCheck,
  ChevronRight,
  Flame,
  CheckCircle2,
  X
} from 'lucide-react';

export const WebHeroFigma = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isCallingCourier, setIsCallingCourier] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Figma-Inspired Vibrant Emerald Hero Section */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0e843b 0%, #0c7534 50%, #075223 100%)',
          borderRadius: 'var(--radius-2xl, 24px)',
          padding: '4rem 3.5rem',
          color: '#ffffff',
          overflow: 'hidden',
          boxShadow: '0 24px 48px -12px rgba(14, 132, 59, 0.35)',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.85fr)',
          alignItems: 'center',
          gap: '3rem',
          minHeight: '520px'
        }}
        className="web-figma-hero"
      >
        {/* Decorative Background Elements */}
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '550px',
            height: '550px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 183, 3, 0.12) 0%, rgba(255, 183, 3, 0) 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Small floating decorative particles */}
        <div
          style={{
            position: 'absolute',
            top: '48%',
            left: '48%',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: '#ffb703',
            boxShadow: '0 0 12px #ffb703',
            animation: 'pulse 2.5s infinite ease-in-out'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            right: '8%',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#e60023',
            boxShadow: '0 0 14px #e60023',
            animation: 'pulse 3s infinite ease-in-out'
          }}
        />

        {/* Left Column: Headline & Action CTAs */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Eyebrow Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '0.4rem 1rem',
                borderRadius: '100px',
                fontSize: '0.88rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                color: '#ffffff'
              }}
            >
              <span style={{ fontSize: '1rem' }}>🍲</span> Happy Healthy Campus Dining
            </span>
          </div>

          {/* Figma Master Headline */}
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 4.2vw, 3.75rem)',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              margin: 0
            }}
          >
            Kick the Diet, <br />
            Embrace <span style={{ color: '#FFB703', textShadow: '0 4px 20px rgba(255, 183, 3, 0.4)' }}>Healthy</span> Food
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.08rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.92)',
              maxWidth: '540px',
              margin: 0,
              fontWeight: 400
            }}
          >
            Hot tasty meals reach your hostel or department in 15-20 minutes. 
            Enjoy freshly cooked chef specials, protein bowls, and campus classics with zero queue waiting.
          </p>

          {/* Dual Action CTAs (Figma Exact Style) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <Link
              to="/menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                backgroundColor: '#FF8C00',
                backgroundImage: 'linear-gradient(135deg, #FFA500 0%, #FF7700 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.05rem',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '1.05rem 2.25rem',
                borderRadius: '100px',
                boxShadow: '0 12px 28px rgba(255, 119, 0, 0.45)',
                textDecoration: 'none',
                transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(255, 119, 0, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(255, 119, 0, 0.45)';
              }}
            >
              ORDER NOW <ArrowRight size={18} />
            </Link>

            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '0.5rem 0.75rem',
                borderRadius: '100px',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <span
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Play size={18} color="#e60023" fill="#e60023" style={{ marginLeft: '2px' }} />
              </span>
              <span>Watch Video</span>
            </button>
          </div>

          {/* Trust Highlights Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.75rem',
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem' }}>
              <CheckCircle2 size={16} color="#ffb703" /> <span>100% Fresh Daily</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem' }}>
              <CheckCircle2 size={16} color="#ffb703" /> <span>FSSAI Certified Kitchen</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem' }}>
              <CheckCircle2 size={16} color="#ffb703" /> <span>Instant OTP Counter Pickups</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual & 3 Floating Interactive Badges */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '440px'
          }}
        >
          {/* Subtle Glow backdrop under plate */}
          <div
            style={{
              position: 'absolute',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '2px dashed rgba(255, 255, 255, 0.25)',
              animation: 'spin 40s linear infinite'
            }}
          />

          {/* Main Hero Gourmet Platter Image */}
          <div
            style={{
              position: 'relative',
              width: '370px',
              height: '370px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.45)',
              border: '8px solid rgba(255, 255, 255, 0.15)',
              transition: 'transform 0.4s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src="/images/gourmet_hero_plate.jpg"
              alt="Delicious Gourmet Campus Meal Platter"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = '/images/south_indian_thali.jpg';
              }}
            />
          </div>

          {/* Floating Badge 1: Top-Left Orange Clock Badge */}
          <div
            style={{
              position: 'absolute',
              top: '5%',
              left: '0%',
              backgroundColor: '#FF8C00',
              color: '#ffffff',
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 24px rgba(255, 140, 0, 0.45)',
              transform: 'rotate(-8deg)',
              zIndex: 20
            }}
            title="Express 15-20 Min Preparation"
          >
            <Clock size={28} strokeWidth={2.5} />
          </div>

          {/* Floating Badge 2: Top-Right Delivery Partner Pill (Figma Exact) */}
          <div
            style={{
              position: 'absolute',
              top: '8%',
              right: '-8%',
              backgroundColor: '#ffffff',
              color: '#1a202c',
              padding: '0.65rem 1.15rem 0.65rem 0.85rem',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              boxShadow: '0 18px 36px -6px rgba(0, 0, 0, 0.28)',
              zIndex: 20,
              minWidth: '220px',
              animation: 'bounce 4s ease-in-out infinite'
            }}
          >
            {/* Courier Avatar */}
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: '#fed7aa',
                flexShrink: 0,
                border: '2px solid #ffedd5'
              }}
            >
              <img
                src="/images/courier_avatar.jpg"
                alt="Richard Watson"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Courier Info */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', lineHeight: 1.2 }}>
                Richard Watson
              </span>
              <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                Food Delivery Boy
              </span>
            </div>

            {/* Call Action Button */}
            <button
              type="button"
              onClick={() => {
                setIsCallingCourier(true);
                setTimeout(() => setIsCallingCourier(false), 3000);
              }}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#e60023',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 4px 10px rgba(230, 0, 35, 0.4)',
                transition: 'transform 0.2s'
              }}
              title="Call Delivery Partner"
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Phone size={15} fill="#ffffff" />
            </button>
          </div>

          {/* Floating Badge 3: Bottom-Left Dish Card with Stars & Price (Figma Exact) */}
          <div
            style={{
              position: 'absolute',
              bottom: '-4%',
              left: '4%',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              padding: '0.85rem 1.25rem',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.3)',
              zIndex: 20
            }}
          >
            {/* Dish Thumbnail */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                overflow: 'hidden',
                backgroundColor: '#f1f5f9',
                flexShrink: 0
              }}
            >
              <img
                src="/images/gourmet_hero_plate.jpg"
                alt="Chef Special Steak"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#0f172a' }}>
                Steaks & Rice Bowl
              </span>
              
              {/* Stars */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b' }}>
                <Star size={13} fill="#f59e0b" />
                <Star size={13} fill="#f59e0b" />
                <Star size={13} fill="#f59e0b" />
                <Star size={13} fill="#f59e0b" />
                <Star size={13} fill="#f59e0b" />
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                <span style={{ color: '#e60023', fontWeight: 900, fontSize: '1.08rem' }}>
                  ₹149
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                  ₹199
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Video / Story Modal */}
      {isVideoModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.78)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem'
          }}
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#111827',
              borderRadius: '24px',
              padding: '2rem',
              maxWidth: '620px',
              width: '100%',
              color: '#ffffff',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <Sparkles size={20} color="#ffb703" />
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>CampusBite Kitchen Story</h3>
            </div>

            <p style={{ color: '#9ca3af', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Watch how our chefs prepare hot, organic farm-to-campus meals fresh every 45 minutes, with automated steam trays and sanitized packaging for student safety.
            </p>

            <div
              style={{
                width: '100%',
                height: '240px',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                marginTop: '1.25rem',
                backgroundColor: '#1f2937'
              }}
            >
              <img
                src="/images/back.jpg"
                alt="Kitchen Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  background: 'rgba(0,0,0,0.45)'
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#e60023',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(230, 0, 35, 0.6)'
                  }}
                >
                  <Play size={22} fill="#ffffff" color="#ffffff" style={{ marginLeft: '3px' }} />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                  Central Canteen Live Stream Active
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setIsVideoModalOpen(false);
                  navigate('/menu');
                }}
                style={{
                  backgroundColor: '#FF8C00',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '100px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
              >
                Explore Full Menu Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Courier Calling Toast notification */}
      {isCallingCourier && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            border: '1px solid #334155'
          }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: '#22c55e',
              animation: 'pulse 1s infinite'
            }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Connecting to Richard Watson...</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Campus Delivery Partner #0872 • Counter 3</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebHeroFigma;
