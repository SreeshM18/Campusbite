import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({
    title,
    message,
    type = 'info', // success | error | warning | info
    duration = 4000
  }) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast = { id, title, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, title = 'Success') => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((message, title = 'Error') => {
    return addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((message, title = 'Warning') => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((message, title = 'Info') => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastContainer = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="toast-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 'var(--z-toast)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '400px',
        width: 'calc(100% - 32px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}

      <style>{`
        @media (max-width: 640px) {
          .toast-container {
            right: 16px !important;
            left: 16px !important;
            bottom: calc(72px + env(safe-area-inset-bottom, 16px)) !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const getTypeConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: <CheckCircle2 size={18} color="var(--color-success)" />,
          borderColor: 'var(--color-success)',
          bg: '#ffffff'
        };
      case 'error':
        return {
          icon: <AlertCircle size={18} color="var(--color-danger)" />,
          borderColor: 'var(--color-danger)',
          bg: '#ffffff'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={18} color="var(--color-warning)" />,
          borderColor: 'var(--color-warning)',
          bg: '#ffffff'
        };
      case 'info':
      default:
        return {
          icon: <Info size={18} color="var(--color-info)" />,
          borderColor: 'var(--color-info)',
          bg: '#ffffff'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div
      className="animate-fade-scale"
      role="alert"
      style={{
        pointerEvents: 'auto',
        backgroundColor: config.bg,
        borderLeft: `4px solid ${config.borderColor}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        borderTop: '1px solid var(--color-border-subtle)',
        borderRight: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
        padding: '0.85rem 1rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}
    >
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{config.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <h5
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              lineHeight: 1.25,
              marginBottom: toast.message ? '2px' : 0
            }}
          >
            {toast.title}
          </h5>
        )}
        {toast.message && (
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: 0 }}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        style={{
          color: 'var(--color-text-muted)',
          padding: '2px',
          borderRadius: 'var(--radius-xs)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
        aria-label="Dismiss notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};
