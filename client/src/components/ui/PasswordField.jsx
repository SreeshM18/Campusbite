import React, { useState, forwardRef } from 'react';
import { TextField } from './TextField';
import { Eye, EyeOff, Lock } from 'lucide-react';

/**
 * CampusBite PasswordField Primitive with Show/Hide Toggle
 */
export const PasswordField = forwardRef(({
  label = 'Password',
  placeholder = '••••••••',
  autoComplete = 'current-password',
  showLockIcon = true,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const trailingToggle = (
    <button
      type="button"
      onClick={toggleVisibility}
      className="focus-ring"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-text-muted)',
        borderRadius: 'var(--radius-xs)',
        transition: 'color var(--transition-fast)'
      }}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      title={showPassword ? 'Hide password' : 'Show password'}
      tabIndex={0}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  );

  return (
    <TextField
      ref={ref}
      label={label}
      type={showPassword ? 'text' : 'password'}
      placeholder={placeholder}
      autoComplete={autoComplete}
      leadingIcon={showLockIcon ? <Lock size={18} /> : null}
      trailingIcon={trailingToggle}
      {...props}
    />
  );
});

PasswordField.displayName = 'PasswordField';
