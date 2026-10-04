import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStatusMeta } from '../../utils/orderConstants';
import { formatCurrency, formatOrderDate, summarizeItems } from '../../utils/formatters';
import { RotateCcw, ArrowRight, Loader2 } from 'lucide-react';

export const PastOrderRow = ({ order, onReorder }) => {
  const [reordering, setReordering] = useState(false);
  if (!order) return null;

  const meta = getStatusMeta(order.status);
  const StatusIcon = meta.icon;

  const handleReorderClick = async () => {
    try {
      setReordering(true);
      await onReorder(order);
    } finally {
      setReordering(false);
    }
  };

  return (
    <article
      aria-label={`Past Order ${order.token} - ${meta.label}`}
      className="card"
      style={{
        borderRadius: 'var(--radius-lg)',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: '1.25rem',
        marginBottom: '0.85rem',
        transition: 'border-color 0.15s ease'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '0.65rem'
        }}
      >
        {/* Token + Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span
            role="text"
            aria-label={`Pickup token ${order.token}`}
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: 'var(--color-brand-primary)',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            {order.token}
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            {formatOrderDate(order.createdAt)}
          </span>
        </div>

        {/* Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: meta.bgColor,
            color: meta.color,
            border: `1px solid ${meta.borderColor}`,
            padding: '0.2rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 700
          }}
        >
          <StatusIcon size={12} />
          <span>{meta.badgeText}</span>
        </div>
      </div>

      {/* Middle Item Summary */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '1rem'
        }}
      >
        <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
          {summarizeItems(order.items, 3)}
        </p>
        <span style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--color-text-primary)' }}>
          {formatCurrency(order.subtotal || order.totalAmount)}
        </span>
      </div>

      {/* Actions Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.65rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--color-border-subtle)'
        }}
      >
        {onReorder && order.status === 'COMPLETED' && (
          <button
            type="button"
            onClick={handleReorderClick}
            disabled={reordering}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            aria-label={`Order again dishes from order ${order.token}`}
          >
            {reordering ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
            <span>{reordering ? 'Adding...' : 'Order Again'}</span>
          </button>
        )}

        <Link
          to={`/orders/${order._id}`}
          className="btn btn-ghost btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            textDecoration: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--color-brand-primary)'
          }}
          aria-label={`View receipt for order ${order.token}`}
        >
          <span>View Details</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </article>
  );
};
