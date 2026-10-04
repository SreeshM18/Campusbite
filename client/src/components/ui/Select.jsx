import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * CampusBite Select Dropdown Primitive
 */
export const Select = forwardRef(({
  label,
  id,
  name,
  options = [],
  value,
  defaultValue,
  onChange,
  onBlur,
  helper,
  error,
  required = false,
  disabled = false,
  placeholder,
  children,
  className = '',
  selectClassName = '',
  style = {},
  selectStyle = {},
  ...props
}, ref) => {
  const selectId = id || name || `select-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`form-group ${className}`} style={{ ...style, width: '100%' }}>
      {label && (
        <label htmlFor={selectId} className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {label}
          {required && <span style={{ color: 'var(--color-danger)', fontWeight: 700 }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          className={`form-select ${error ? 'is-error' : ''} ${selectClassName}`}
          style={{
            appearance: 'none',
            paddingRight: '36px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            ...selectStyle
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${selectId}-error` : helper ? `${selectId}-helper` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.length > 0
            ? options.map((opt) => {
                const optVal = typeof opt === 'object' ? opt.value : opt;
                const optLabel = typeof opt === 'object' ? opt.label : opt;
                return (
                  <option key={optVal} value={optVal}>
                    {optLabel}
                  </option>
                );
              })
            : children}
        </select>

        <div
          style={{
            position: 'absolute',
            right: '12px',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-text-secondary)'
          }}
        >
          <ChevronDown size={18} />
        </div>
      </div>

      {error ? (
        <p id={`${selectId}-error`} className="form-error" role="alert">
          {error}
        </p>
      ) : helper ? (
        <p id={`${selectId}-helper`} className="form-helper">
          {helper}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
