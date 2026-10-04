import React from 'react';
import { Utensils } from 'lucide-react';

/**
 * CampusBite Universal Empty State Primitive
 */
export const EmptyState = ({
  icon = <Utensils size={36} color="var(--color-brand-primary)" />,
  title = 'Nothing Found',
  description = 'There are no items matching your criteria right now.',
  action = null,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`card ${className}`}
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-surface)',
        border: '1px dashed var(--color-border-strong)',
        borderRadius: 'var(--radius-xl)',
        ...style
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-brand-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          marginBottom: '0.4rem'
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-secondary)',
          maxWidth: '420px',
          lineHeight: 1.5,
          marginBottom: action ? '1.5rem' : 0
        }}
      >
        {description}
      </p>

      {action && <div>{action}</div>}
    </div>
  );
};
