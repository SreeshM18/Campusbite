import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem 1.25rem'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--brand-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--brand-primary)',
          marginBottom: '1.5rem'
        }}
      >
        <UtensilsCrossed size={36} />
      </div>

      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        404 — Page Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', marginBottom: '2rem' }}>
        The canteen page or token you're looking for doesn't exist or has moved.
      </p>

      <Link to="/" className="btn btn-primary btn-lg">
        <ArrowLeft size={18} /> Return to Homepage
      </Link>
    </div>
  );
};
