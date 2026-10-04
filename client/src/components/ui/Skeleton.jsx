import React from 'react';

/**
 * CampusBite Skeleton Loader Primitive
 * Variants: text | circular | rectangular | card
 */
export const Skeleton = ({
  variant = 'text', // text | circular | rectangular | card
  width,
  height,
  borderRadius,
  className = '',
  style = {},
  count = 1
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'circular':
        return {
          width: width || '40px',
          height: height || '40px',
          borderRadius: '50%'
        };
      case 'rectangular':
        return {
          width: width || '100%',
          height: height || '120px',
          borderRadius: borderRadius || 'var(--radius-md)'
        };
      case 'card':
        return {
          width: width || '100%',
          height: height || '220px',
          borderRadius: borderRadius || 'var(--radius-lg)'
        };
      case 'text':
      default:
        return {
          width: width || '100%',
          height: height || '16px',
          borderRadius: borderRadius || 'var(--radius-xs)'
        };
    }
  };

  const renderSingleSkeleton = (key) => (
    <div
      key={key}
      className={`animate-shimmer ${className}`}
      style={{
        ...getVariantStyle(),
        marginBottom: count > 1 ? '8px' : 0,
        ...style
      }}
      aria-hidden="true"
    />
  );

  if (count > 1) {
    return (
      <div className="skeleton-group" role="status" aria-label="Loading content...">
        {Array.from({ length: count }).map((_, index) => renderSingleSkeleton(index))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return renderSingleSkeleton(0);
};
