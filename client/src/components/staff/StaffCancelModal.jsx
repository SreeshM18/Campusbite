import React, { useState } from 'react';
import { AlertCircle, X, Loader2 } from 'lucide-react';

export const StaffCancelModal = ({ order, isOpen, onClose, onConfirmCancel }) => {
  const [reason, setReason] = useState('Item out of stock / ingredients finished');
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
      setError(err.message || 'Failed to reject order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="staff-cancel-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
          backgroundColor: '#ffffff',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative'
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#dc2626', marginBottom: '1rem' }}>
          <AlertCircle size={24} />
          <h2 id="staff-cancel-title" className="type-h4" style={{ margin: 0, color: '#dc2626' }}>
            Cancel Kitchen Order Ticket
          </h2>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Cancel ticket <strong>#{order.token}</strong> for customer <strong>{order.user?.name || 'Student'}</strong>.
        </p>

        {error && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.5rem' }}>
            Staff Cancellation Reason:
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="input"
            style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#f8fafc' }}
          >
            <option value="Item out of stock / ingredients finished">Item out of stock / ingredients finished</option>
            <option value="Kitchen equipment issue / counter closure">Kitchen equipment issue / counter closure</option>
            <option value="Student requested counter cancellation">Student requested counter cancellation</option>
            <option value="Other">Other staff note...</option>
          </select>

          {reason === 'Other' && (
            <input
              type="text"
              placeholder="Enter exact reason"
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
              Keep in Queue
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
