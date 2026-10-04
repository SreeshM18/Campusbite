import React from 'react';

/**
 * CampusBite Universal Page Container Primitive
 * Standard layout boundaries and responsive gutters.
 */
export const PageContainer = ({
  children,
  size = 'standard', // narrow (840px) | standard (1240px) | wide (1400px) | form (480px) | full
  paddingY = 'md', // none | sm | md | lg | xl
  className = '',
  style = {},
  ...props
}) => {
  const getContainerClass = () => {
    switch (size) {
      case 'narrow':
        return 'container-narrow';
      case 'wide':
        return 'container-wide';
      case 'form':
        return 'container-form';
      case 'full':
        return '';
      case 'standard':
      default:
        return 'container';
    }
  };

  const getPaddingYStyle = () => {
    switch (paddingY) {
      case 'none':
        return { paddingTop: 0, paddingBottom: 0 };
      case 'sm':
        return { paddingTop: '1.25rem', paddingBottom: '1.25rem' };
      case 'lg':
        return { paddingTop: '3.5rem', paddingBottom: '3.5rem' };
      case 'xl':
        return { paddingTop: '5rem', paddingBottom: '5rem' };
      case 'md':
      default:
        return { paddingTop: '2.25rem', paddingBottom: '2.25rem' };
    }
  };

  return (
    <div
      className={`${getContainerClass()} ${className}`}
      style={{
        ...getPaddingYStyle(),
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
