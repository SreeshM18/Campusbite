import React, { forwardRef } from 'react';

/**
 * CampusBite TextField Form Primitive
 */
export const TextField = forwardRef(({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  onFocus,
  helper,
  error,
  required = false,
  disabled = false,
  readOnly = false,
  leadingIcon = null,
  trailingIcon = null,
  className = '',
  inputClassName = '',
  style = {},
  inputStyle = {},
  ...props
}, ref) => {
  const inputId = id || name || `field-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`form-group ${className}`} style={{ ...style, width: '100%' }}>
      {label && (
        <label htmlFor={inputId} className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {label}
          {required && <span style={{ color: 'var(--color-danger)', fontWeight: 700 }} title="Required field">*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {leadingIcon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: error ? 'var(--color-danger)' : 'var(--color-text-muted)'
            }}
          >
            {leadingIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`form-input ${error ? 'is-error' : ''} ${inputClassName}`}
          style={{
            paddingLeft: leadingIcon ? '40px' : '14px',
            paddingRight: trailingIcon ? '40px' : '14px',
            ...inputStyle
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined}
          {...props}
        />

        {trailingIcon && (
          <div
            style={{
              position: 'absolute',
              right: '12px',
              display: 'flex',
              alignItems: 'center',
              color: error ? 'var(--color-danger)' : 'var(--color-text-muted)'
            }}
          >
            {trailingIcon}
          </div>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </p>
      ) : helper ? (
        <p id={`${inputId}-helper`} className="form-helper">
          {helper}
        </p>
      ) : null}
    </div>
  );
});

TextField.displayName = 'TextField';
