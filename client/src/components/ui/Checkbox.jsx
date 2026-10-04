import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

/**
 * CampusBite Accessible Checkbox Primitive
 */
export const Checkbox = forwardRef(({
  label,
  id,
  name,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  description,
  className = '',
  style = {},
  ...props
}, ref) => {
  const checkId = id || name || `check-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <label
      htmlFor={checkId}
      className={`min-touch-target ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: '0.65rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
        ...style
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '2px' }}>
        <input
          ref={ref}
          type="checkbox"
          id={checkId}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only focus-ring"
          {...props}
        />
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: 'var(--radius-xs)',
            border: checked ? 'none' : '1.5px solid var(--color-border-strong)',
            backgroundColor: checked ? 'var(--color-brand-primary)' : 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            transition: 'all var(--transition-fast)',
            boxShadow: checked ? 'var(--shadow-xs)' : 'none'
          }}
        >
          {checked && <Check size={13} strokeWidth={3.5} />}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {label}
        </span>
        {description && (
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {description}
          </span>
        )}
      </div>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

/**
 * CampusBite Accessible Radio Primitive
 */
export const Radio = forwardRef(({
  label,
  id,
  name,
  value,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  description,
  className = '',
  style = {},
  ...props
}, ref) => {
  const radioId = id || `radio-${name}-${value}`;

  return (
    <label
      htmlFor={radioId}
      className={`min-touch-target ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: '0.65rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        userSelect: 'none',
        ...style
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginTop: '2px' }}>
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only focus-ring"
          {...props}
        />
        <div
          style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            border: checked ? '2px solid var(--color-brand-primary)' : '1.5px solid var(--color-border-strong)',
            backgroundColor: 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)'
          }}
        >
          {checked && (
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-brand-primary)'
              }}
            />
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {label}
        </span>
        {description && (
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {description}
          </span>
        )}
      </div>
    </label>
  );
});

Radio.displayName = 'Radio';
