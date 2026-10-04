import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * CampusBite Spinner Loader Primitive
 * Sizes: sm (16px) | md (24px) | lg (36px) | xl (48px)
 */
export const Spinner = ({
  size = 'md',
  color = 'var(--color-brand-primary)',
  label = 'Loading...',
  showLabel = false,
  center = false,
  className = '',
  style = {}
}) => {
  const getPixelSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 36;
      case 'xl':
        return 48;
      case 'md':
      default:
        return 24;
    }
  };

  const spinnerElement = (
    <div
      className={`spinner-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        flexDirection: showLabel ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.65rem',
        ...style
      }}
      role="status"
      aria-label={label}
    >
      <Loader2
        size={getPixelSize()}
        color={color}
        className="animate-spin"
        style={{ flexShrink: 0 }}
      />
      {showLabel && (
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
          {label}
        </span>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );

  if (center) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem',
          width: '100%'
        }}
      >
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};
