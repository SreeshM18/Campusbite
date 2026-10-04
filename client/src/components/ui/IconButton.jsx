import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * CampusBite Dedicated Icon Button Primitive
 * Shapes: square | rounded | pill
 * Sizes: sm (32px) | md (40px) | lg (48px)
 */
export const IconButton = ({
  icon,
  'aria-label': ariaLabel,
  title,
  variant = 'ghost', // ghost | outline | primary | secondary | danger
  size = 'md', // sm | md | lg
  shape = 'rounded', // rounded | circle | square
  loading = false,
  disabled = false,
  onClick,
  className = '',
  style = {},
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-brand-primary)',
          color: '#ffffff',
          boxShadow: 'var(--shadow-xs)',
          border: 'none'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-brand-secondary)',
          color: '#ffffff',
          border: 'none'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          border: '1.5px solid var(--color-border)'
        };
      case 'danger':
        return {
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          border: '1px solid #fecaca'
        };
      case 'ghost':
      default:
        return {
          backgroundColor: 'transparent',
          color: 'var(--color-text-secondary)',
          border: 'none'
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' };
      case 'lg':
        return { width: '48px', height: '48px', minWidth: '48px', minHeight: '48px' };
      case 'md':
      default:
        return { width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' };
    }
  };

  const getShapeStyle = () => {
    switch (shape) {
      case 'circle':
        return { borderRadius: '50%' };
      case 'square':
        return { borderRadius: 'var(--radius-xs)' };
      case 'rounded':
      default:
        return { borderRadius: size === 'lg' ? 'var(--radius-lg)' : 'var(--radius-md)' };
    }
  };

  return (
    <button
      type="button"
      className={`btn-icon focus-ring ${className}`}
      aria-label={ariaLabel || title}
      title={title || ariaLabel}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        ...getVariantStyle(),
        ...getSizeStyle(),
        ...getShapeStyle(),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all var(--transition-fast)',
        ...style
      }}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 18} className="animate-spin" />
      ) : (
        icon
      )}
    </button>
  );
};
