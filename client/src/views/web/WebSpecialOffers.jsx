import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sparkles, ArrowRight, Copy, Check } from 'lucide-react';

export const WebSpecialOffers = () => {
  const [copiedCode, setCopiedCode] = React.useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section style={{ width: '100%' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Promo Card 1: 50% Welcome */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #FF6B00 0%, #EA580C 100%)',
            borderRadius: 'var(--radius-xl, 20px)',
            padding: '2rem 2.25rem',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflow: 'hidden',
            boxShadow: '0 16px 32px -8px rgba(234, 88, 12, 0.35)'
          }}
        >
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '65%' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '0.25rem 0.75rem',
                borderRadius: '100px',
                fontSize: '0.78rem',
                fontWeight: 800,
                marginBottom: '0.75rem'
              }}
            >
              <Tag size={13} /> FIRST SEMESTER SPECIAL
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.5rem 0', lineHeight: 1.15 }}>
              Flat 50% OFF on 1st Order
            </h3>
            <p style={{ fontSize: '0.88rem', margin: '0 0 1.25rem 0', color: 'rgba(255, 255, 255, 0.9)' }}>
              Use coupon at checkout for instant discount up to ₹100.
            </p>

            <button
              type="button"
              onClick={() => handleCopy('WELCOME50')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#ffffff',
                color: '#EA580C',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              {copiedCode === 'WELCOME50' ? (
                <>
                  <Check size={16} /> COPIED!
                </>
              ) : (
                <>
                  <Copy size={16} /> CODE: WELCOME50
                </>
              )}
            </button>
          </div>

          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
            }}
          >
            <img
              src="/images/cheese_pizza.jpg"
              alt="Pizza Offer"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Promo Card 2: Healthy Lunch Thali Combo */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #0F8A3C 0%, #065F26 100%)',
            borderRadius: 'var(--radius-xl, 20px)',
            padding: '2rem 2.25rem',
            color: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflow: 'hidden',
            boxShadow: '0 16px 32px -8px rgba(15, 138, 60, 0.35)'
          }}
        >
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '65%' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '0.25rem 0.75rem',
                borderRadius: '100px',
                fontSize: '0.78rem',
                fontWeight: 800,
                marginBottom: '0.75rem'
              }}
            >
              <Sparkles size={13} /> NUTRITION PASS
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '0 0 0.5rem 0', lineHeight: 1.15 }}>
              Hostel Thali Meal Pass
            </h3>
            <p style={{ fontSize: '0.88rem', margin: '0 0 1.25rem 0', color: 'rgba(255, 255, 255, 0.9)' }}>
              Unlimited rice, dal, subji & curd cup for just ₹80 daily.
            </p>

            <Link
              to="/menu"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#ffffff',
                color: '#0F8A3C',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.88rem'
              }}
            >
              Order Combo <ArrowRight size={16} />
            </Link>
          </div>

          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
            }}
          >
            <img
              src="/images/south_indian_thali.jpg"
              alt="Thali Meal"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebSpecialOffers;
