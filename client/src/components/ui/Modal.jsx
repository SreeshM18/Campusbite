import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * CampusBite Accessible Modal Dialog Primitive
 */
export const Modal = ({
  isOpen = false,
  onClose,
  title,
  description,
  children,
  actions,
  maxWidth = '540px',
  showCloseButton = true,
  className = '',
  closeOnBackdrop = true
}) => {
  const modalRef = useRef(null);

  // Lock body scroll and handle Escape key
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
      className="modal-backdrop animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(27, 31, 43, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) {
          onClose?.();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={modalRef}
        className={`card animate-fade-scale ${className}`}
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 2rem)',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div>
              {title && (
                <h3
                  id="modal-title"
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
              {description && (
                <p id="modal-description" className="type-caption" style={{ marginTop: '4px', margin: 0 }}>
                  {description}
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
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Modal Content Body */}
        <div
          style={{
            padding: '1.5rem',
            overflowY: 'auto',
            flex: 1
          }}
        >
          {children}
        </div>

        {/* Modal Action Bar */}
        {actions && (
          <div
            style={{
              padding: '1rem 1.5rem',
              backgroundColor: 'var(--color-surface-subtle)',
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}
          >
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
