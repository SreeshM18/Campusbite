import React from 'react';

/**
 * CampusBite Core Badge Primitive
 * Variants: neutral | brand | success | warning | danger | info
 * Sizes: sm | md | lg
 */
export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon = null,
  className = '',
  style = {},
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'brand':
        return 'badge-brand';
      case 'success':
        return 'badge-success';
      case 'warning':
        return 'badge-warning';
      case 'danger':
        return 'badge-danger';
      case 'info':
        return 'badge-info';
      case 'neutral':
      default:
        return 'badge-neutral';
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { fontSize: '0.68rem', padding: '0.15rem 0.45rem' };
      case 'lg':
        return { fontSize: '0.85rem', padding: '0.35rem 0.85rem' };
      case 'md':
      default:
        return {};
    }
  };

  return (
    <span
      className={`badge ${getVariantClass()} ${className}`}
      style={{ ...getSizeStyle(), ...style }}
      {...props}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
