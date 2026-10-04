import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * CampusBite Side Drawer / Off-Canvas Primitive
 */
export const Drawer = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = '420px',
  placement = 'right', // right | left
  showCloseButton = true,
  className = ''
}) => {
  const drawerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="drawer-backdrop animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(27, 31, 43, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 'var(--z-drawer)',
        display: 'flex',
        justifyContent: placement === 'left' ? 'flex-start' : 'flex-end'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'drawer-title' : undefined}
    >
      <div
        ref={drawerRef}
        className={`animate-slide-right ${className}`}
        style={{
          width: '100%',
          maxWidth: width,
          height: '100%',
          backgroundColor: 'var(--color-surface)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2,
          position: 'relative'
        }}
      >
        {/* Drawer Header */}
        {(title || showCloseButton) && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              backgroundColor: 'var(--color-surface)'
            }}
          >
            <div>
              {title && (
                <h3
                  id="drawer-title"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color: 'var(--color-text-primary)',
                    margin: 0
                  }}
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="type-caption" style={{ marginTop: '2px', margin: 0 }}>
                  {subtitle}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="btn-icon btn-icon-sm"
                style={{
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Close drawer"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Drawer Content Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem'
          }}
        >
          {children}
        </div>

        {/* Drawer Footer Actions */}
        {footer && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.03)'
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
