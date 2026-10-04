import React from 'react';
import { Link } from 'react-router-dom';
import { getStatusMeta } from '../../utils/orderConstants';
import { formatCurrency, formatTimeAgo, summarizeItems } from '../../utils/formatters';
import { ArrowRight, Clock, MapPin, Sparkles, XCircle } from 'lucide-react';

export const ActiveOrderCard = ({ order, onCancelClick }) => {
  if (!order) return null;

  const meta = getStatusMeta(order.status);
  const StatusIcon = meta.icon;
  const isReady = order.status === 'READY';
  const isPending = order.status === 'PENDING';

  return (
    <article
      aria-label={`Active Order ${order.token} - ${meta.label}`}
      className="card"
      style={{
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--color-surface)',
        border: isReady ? '2px solid var(--color-status-ready)' : '1px solid var(--color-border)',
        boxShadow: isReady ? '0 8px 24px -4px rgba(22, 163, 74, 0.22)' : 'var(--shadow-md)',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.2s ease',
        marginBottom: '1.5rem'
      }}
    >
      {/* Top Banner for Ready Status */}
      {isReady && (
        <div
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: 'var(--color-status-ready)',
            color: '#ffffff',
            padding: '0.65rem 1.25rem',
            fontSize: '0.86rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} />
            <span>🎉 Ready for Pickup! Flash Token at Counter #3 for instant collection.</span>
          </div>
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.95 }}>
            Counter #3
          </span>
        </div>
      )}

      <div style={{ padding: '1.5rem' }}>
        {/* Header Row: Token + Status Pill */}
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
          {/* Perforated Token Pill */}
          <div
            role="text"
            aria-label={`Pickup token ${order.token}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'var(--color-brand-subtle)',
              color: 'var(--color-brand-primary)',
              border: '1.5px dashed var(--color-brand-primary)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '0.05em'
            }}
          >
            <span>{order.token}</span>
          </div>

          {/* Status Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: meta.bgColor,
              color: meta.color,
              border: `1px solid ${meta.borderColor}`,
              padding: '0.3rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <StatusIcon size={14} />
            <span>• {meta.badgeText}</span>
          </div>
        </div>

        {/* Middle Details: Summary + Timing */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '0.35rem',
              lineHeight: 1.3
            }}
          >
            {summarizeItems(order.items, 3)}
          </h3>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.85rem',
              fontSize: '0.84rem',
              color: 'var(--color-text-secondary)'
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Clock size={13} color="var(--color-text-muted)" />
              <span>{order.pickupTime}</span>
            </span>
            <span>•</span>
            <span style={{ color: 'var(--color-text-muted)' }}>
              Placed {formatTimeAgo(order.createdAt)}
            </span>
            <span>•</span>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
              {formatCurrency(order.subtotal || order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border-subtle)'
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            <MapPin size={14} color="var(--color-brand-primary)" />
            <span>Central Food Court • Counter #3</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isPending && onCancelClick && (
              <button
                type="button"
                onClick={() => onCancelClick(order)}
                className="btn btn-secondary btn-sm"
                style={{
                  color: 'var(--color-danger)',
                  borderColor: 'var(--color-danger-bg)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
                aria-label={`Cancel order ${order.token}`}
              >
                <XCircle size={14} />
                <span>Cancel</span>
              </button>
            )}

            <Link
              to={`/orders/${order._id}`}
              className="btn btn-primary btn-sm"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                textDecoration: 'none'
              }}
              aria-label={`Track order ${order.token}`}
            >
              <span>Track Live Kitchen</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
