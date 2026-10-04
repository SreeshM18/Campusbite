import React from 'react';
import { Sparkles } from 'lucide-react';

export const TokenBadge = ({ token, pickupTime, compact = false }) => {
  if (!token) return null;

  if (compact) {
    return (
      <div
        role="text"
        aria-label={`Pickup token ${token}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          backgroundColor: 'var(--color-brand-light)',
          color: 'var(--color-brand-primary)',
          border: '1.5px dashed var(--color-brand-primary)',
          padding: '0.3rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '1rem',
          letterSpacing: '0.05em'
        }}
      >
        <span>{token}</span>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={`Official Canteen Pickup Token ${token}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '2px dashed var(--color-brand-primary)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '440px',
        margin: '0 auto'
      }}
    >
      {/* Ticket Cutout Accents */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '-14px',
          width: '28px',
          height: '28px',
          backgroundColor: 'var(--color-canvas)',
          borderRadius: '50%',
          transform: 'translateY(-50%)',
          borderRight: '2px solid var(--color-border)'
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          right: '-14px',
          width: '28px',
          height: '28px',
          backgroundColor: 'var(--color-canvas)',
          borderRadius: '50%',
          transform: 'translateY(-50%)',
          borderLeft: '2px solid var(--color-border)'
        }}
      />

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-brand-primary)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
        <Sparkles size={14} /> Official Canteen Token
      </div>

      <div
        aria-label={`Pickup token ${token}`}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(1.75rem, 6vw, 2.75rem)',
          fontWeight: 800,
          letterSpacing: '0.06em',
          color: 'var(--color-brand-primary)',
          margin: '0.5rem 0',
          whiteSpace: 'nowrap',
          textShadow: '0 2px 8px rgba(230,81,0,0.15)'
        }}
      >
        {token}
      </div>

      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
        Scheduled Window: <strong style={{ color: 'var(--color-text-primary)' }}>{pickupTime}</strong>
      </div>

      <div
        style={{
          backgroundColor: 'var(--color-surface-subtle)',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.88rem',
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
      >
        <span>📍 Present this token at <strong>Counter #3 (Food Court)</strong></span>
      </div>
    </div>
  );
};
