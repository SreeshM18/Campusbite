import React, { useState } from 'react';
import { AlertCircle, X, Check, Loader2 } from 'lucide-react';

export const CancelOrderModal = ({ order, isOpen, onClose, onConfirmCancel }) => {
  const [reason, setReason] = useState('Change of plan / ordered wrong item');
  const [customReason, setCustomReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const finalReason = reason === 'Other' ? customReason : reason;
      await onConfirmCancel(order._id, finalReason);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to cancel order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '1.75rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close cancellation modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            padding: '0.25rem'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#dc2626', marginBottom: '1rem' }}>
          <AlertCircle size={24} />
          <h2 id="cancel-modal-title" className="type-h4" style={{ margin: 0, color: '#dc2626' }}>
            Cancel Pre-Order?
          </h2>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Are you sure you want to cancel order <strong>#{order.token}</strong>? The canteen kitchen has not started preparing your dishes yet.
        </p>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            Select Cancellation Reason:
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="input"
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            <option value="Change of plan / ordered wrong item">Change of plan / ordered wrong item</option>
            <option value="Break timing changed by faculty">Break timing changed by faculty</option>
            <option value="Selected wrong pickup window">Selected wrong pickup window</option>
            <option value="Other">Other reason...</option>
          </select>

          {reason === 'Other' && (
            <input
              type="text"
              placeholder="Please specify reason"
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              required
              className="input"
              style={{ width: '100%', marginBottom: '1rem' }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary"
            >
              Keep Order
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-danger"
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                borderColor: '#dc2626',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              <span>{loading ? 'Cancelling...' : 'Confirm Cancellation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
