import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * CampusBite Standardized Page Header Component
 */
export const PageHeader = ({
  eyebrow,
  title,
  description,
  actions = null,
  backTo = null,
  backLabel = 'Back',
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`page-header ${className}`}
      style={{
        marginBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        ...style
      }}
    >
      {backTo && (
        <Link
          to={backTo}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            marginBottom: '0.25rem'
          }}
          className="focus-ring"
        >
          <ArrowLeft size={16} />
          <span>{backLabel}</span>
        </Link>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1.25rem'
        }}
      >
        <div style={{ flex: 1, minWidth: '260px' }}>
          {eyebrow && (
            <span
              className="type-label"
              style={{
                color: 'var(--color-brand-primary)',
                display: 'block',
                marginBottom: '0.35rem'
              }}
            >
              {eyebrow}
            </span>
          )}

          <h1
            className="type-h1"
            style={{
              color: 'var(--color-text-primary)',
              margin: 0
            }}
          >
            {title}
          </h1>

          {description && (
            <p
              className="type-body-lg"
              style={{
                marginTop: '0.5rem',
                color: 'var(--color-text-secondary)',
                maxWidth: '680px',
                margin: '0.5rem 0 0'
              }}
            >
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
