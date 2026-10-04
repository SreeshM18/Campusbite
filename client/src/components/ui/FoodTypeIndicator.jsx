import React from 'react';

/**
 * CampusBite Standardized Dietary Food Type Indicator
 * Veg: Green square with green dot
 * Non-Veg: Red/Brown square with red triangle
 */
export const FoodTypeIndicator = ({
  isVeg = true,
  showLabel = false,
  size = 'md', // sm | md | lg
  className = '',
  style = {}
}) => {
  const isVegetarian = Boolean(isVeg);
  const dietaryType = isVegetarian ? 'veg' : 'non-veg';
  const labelText = isVegetarian ? 'Pure Veg' : 'Non-Veg';

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { transform: 'scale(0.85)' };
      case 'lg':
        return { transform: 'scale(1.2)' };
      case 'md':
      default:
        return {};
    }
  };

  return (
    <div
      className={`dietary-indicator-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        userSelect: 'none',
        ...style
      }}
      role="img"
      aria-label={labelText}
      title={labelText}
    >
      <div
        className={`diet-icon ${dietaryType}`}
        style={{ ...getSizeStyle() }}
        aria-hidden="true"
      />
      {showLabel && (
        <span
          style={{
            fontSize: size === 'sm' ? '0.72rem' : '0.8rem',
            fontWeight: 700,
            color: isVegetarian ? 'var(--color-veg)' : 'var(--color-nonveg)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase'
          }}
        >
          {labelText}
        </span>
      )}
    </div>
  );
};
