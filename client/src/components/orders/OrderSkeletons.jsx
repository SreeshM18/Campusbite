import React from 'react';

export const OrderSkeletons = ({ count = 3 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Active Order Card Skeleton */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          marginBottom: '1rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ width: '100px', height: '32px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }} className="skeleton" />
          <div style={{ width: '90px', height: '24px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-full)' }} className="skeleton" />
        </div>
        <div style={{ width: '70%', height: '20px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }} className="skeleton" />
        <div style={{ width: '40%', height: '16px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }} className="skeleton" />
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
          <div style={{ width: '140px', height: '16px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)' }} className="skeleton" />
          <div style={{ width: '130px', height: '36px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)' }} className="skeleton" />
        </div>
      </div>

      {/* Past Order Rows Skeletons */}
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ width: '120px', height: '20px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)' }} className="skeleton" />
            <div style={{ width: '80px', height: '20px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-full)' }} className="skeleton" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '50%', height: '18px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)' }} className="skeleton" />
            <div style={{ width: '60px', height: '18px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)' }} className="skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
};
