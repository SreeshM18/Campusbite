import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * CampusBite Core Button Primitive
 * Variants: primary | secondary | tertiary / outline | ghost | danger
 * Sizes: sm | md | lg
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconBefore = null,
  iconAfter = null,
  type = 'button',
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'secondary':
        return 'btn-secondary';
      case 'tertiary':
      case 'outline':
        return 'btn-outline';
      case 'ghost':
        return 'btn-ghost';
      case 'danger':
        return 'btn-danger';
      default:
        return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'btn-sm';
      case 'lg':
        return 'btn-lg';
      case 'md':
      default:
        return '';
    }
  };

  const combinedClasses = [
    'btn',
    getVariantClass(),
    getSizeClass(),
    fullWidth ? 'btn-full' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin" />
          <span>{typeof children === 'string' ? 'Processing...' : children}</span>
        </>
      ) : (
        <>
          {iconBefore && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{iconBefore}</span>}
          <span>{children}</span>
          {iconAfter && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{iconAfter}</span>}
        </>
      )}
    </button>
  );
};
