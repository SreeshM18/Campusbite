import React from 'react';

/**
 * CampusBite FoodCardSkeleton Component
 * Mirrors the exact geometry and aspect ratio of FoodCard during menu loading.
 */
export const FoodCardSkeleton = () => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface)',
        boxShadow: 'var(--shadow-xs)'
      }}
      aria-hidden="true"
    >
      {/* Image Skeleton Box (4:3 aspect ratio) */}
      <div
        className="animate-shimmer"
        style={{
          width: '100%',
          aspectRatio: '4 / 3',
          backgroundColor: 'var(--color-surface-subtle)',
          position: 'relative'
        }}
      />

      {/* Content Body Skeleton */}
      <div
        style={{
          padding: '1.15rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          {/* Title & Price placeholder */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div
              className="animate-shimmer"
              style={{
                width: '65%',
                height: '20px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--color-surface-subtle)'
              }}
            />
            <div
              className="animate-shimmer"
              style={{
                width: '20%',
                height: '20px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--color-surface-subtle)'
              }}
            />
          </div>

          {/* Description line 1 & 2 */}
          <div
            className="animate-shimmer"
            style={{
              width: '95%',
              height: '14px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-surface-subtle)',
              marginBottom: '6px'
            }}
          />
          <div
            className="animate-shimmer"
            style={{
              width: '70%',
              height: '14px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-surface-subtle)'
            }}
          />
        </div>

        {/* Bottom Bar: Prep time & Action Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: '0.75rem',
            marginTop: '0.25rem'
          }}
        >
          <div
            className="animate-shimmer"
            style={{
              width: '75px',
              height: '14px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-surface-subtle)'
            }}
          />
          <div
            className="animate-shimmer"
            style={{
              width: '95px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface-subtle)'
            }}
          />
        </div>
      </div>
    </div>
  );
};
