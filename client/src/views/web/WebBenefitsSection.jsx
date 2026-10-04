import React from 'react';
import {
  Zap,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  QrCode,
  CreditCard,
  HeartHandshake
} from 'lucide-react';

const BENEFITS = [
  {
    icon: Zap,
    title: 'Zero-Queue Dining',
    description: 'Pre-order from your class or hostel and collect your fresh hot meal at Counter #3 right when it is ready.',
    color: '#FF6B00'
  },
  {
    icon: ShieldCheck,
    title: 'Secure OTP Pickups',
    description: 'Every order generates an instant 4-digit token OTP to guarantee zero mix-ups or stolen trays at peak hours.',
    color: '#10B981'
  },
  {
    icon: CreditCard,
    title: 'Meal Passes & Wallets',
    description: 'Enjoy 1-tap campus student discounts, UPI auto-refunds, and automated hostel mess balance synchronization.',
    color: '#6366F1'
  },
  {
    icon: Award,
    title: 'FSSAI Hygiene Grade A',
    description: '100% freshly cooked with daily temperature-checked kitchen stations and sealed steam-resistant eco containers.',
    color: '#EC4899'
  }
];

export const WebBenefitsSection = () => {
  return (
    <section
      style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-2xl, 24px)',
        padding: '3.5rem 2.5rem',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--brand-primary)',
            fontSize: '0.85rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '0.5rem'
          }}
        >
          <Sparkles size={16} /> Why CampusBite?
        </div>
        <h2
          style={{
            fontSize: '2.1rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            margin: '0 0 0.75rem 0',
            letterSpacing: '-0.02em'
          }}
        >
          Engineered for Smart College Life
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
          Designed specifically to eradicate 20-minute canteen lunch queues and deliver wholesome, affordable student meals.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2rem'
        }}
      >
        {BENEFITS.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.75rem',
                backgroundColor: 'var(--color-canvas, #ffffff)',
                borderRadius: 'var(--radius-xl, 20px)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = item.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={26} />
              </div>

              <div>
                <h3
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    margin: '0 0 0.5rem 0'
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.55,
                    margin: 0
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WebBenefitsSection;
