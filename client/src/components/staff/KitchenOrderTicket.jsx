import React from 'react';
import { getStatusMeta } from '../../utils/orderConstants';
import { formatCurrency, formatTimeAgo } from '../../utils/formatters';
import {
  Clock,
  ChefHat,
  CheckCircle2,
  PackageCheck,
  MessageSquare,
  User,
  ArrowRight,
  Check,
  XCircle,
  Loader2
} from 'lucide-react';

export const KitchenOrderTicket = ({
  order,
  onUpdateStatus,
  onCancelClick,
  actionLoading = false
}) => {
  if (!order) return null;

  const meta = getStatusMeta(order.status);
  const isPending = order.status === 'PENDING';
  const isPreparing = order.status === 'PREPARING';
  const isReady = order.status === 'READY';

  // Calculate order age in minutes to show visual urgency if order is aging
  const ageMinutes = Math.floor((new Date() - new Date(order.createdAt)) / (1000 * 60)) || 0;
  const isAging = ageMinutes >= 15 && (isPending || isPreparing);

  // Next status mapping
  let nextStatus = null;
  let actionLabel = '';
  let ActionIcon = ArrowRight;
  let actionBg = 'var(--color-brand-primary)';

  if (isPending) {
    nextStatus = 'PREPARING';
    actionLabel = 'Start Preparing';
    ActionIcon = ChefHat;
    actionBg = '#2563eb';
  } else if (isPreparing) {
    nextStatus = 'READY';
    actionLabel = 'Mark Ready at Counter #3';
    ActionIcon = CheckCircle2;
    actionBg = '#16a34a';
  } else if (isReady) {
    nextStatus = 'COMPLETED';
    actionLabel = 'Complete Handover';
    ActionIcon = PackageCheck;
    actionBg = '#334155';
  }

  return (
    <div
      className="card"
      style={{
        borderRadius: 'var(--radius-lg)',
        backgroundColor: '#ffffff',
        border: isReady
          ? '2px solid #16a34a'
          : isAging
          ? '2px solid #f59e0b'
          : '1px solid #cbd5e1',
        boxShadow: isReady
          ? '0 6px 16px -2px rgba(22, 163, 74, 0.2)'
          : '0 2px 6px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* 1. Ticket Top Accent & Aging Strip */}
      {isAging && (
        <div
          style={{
            backgroundColor: '#fef3c7',
            color: '#92400e',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.25rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            borderBottom: '1px solid #fde68a'
          }}
        >
          <Clock size={12} />
          <span>Priority: Placed {ageMinutes} mins ago</span>
        </div>
      )}

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 2. Token & Pickup Window Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '0.85rem'
          }}
        >
          {/* Huge Readable Token */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '1.65rem',
              fontWeight: 900,
              letterSpacing: '0.04em',
              color: '#0f172a',
              lineHeight: 1
            }}
          >
            {order.token}
          </div>

          {/* Pickup Window Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#334155',
              whiteSpace: 'nowrap'
            }}
          >
            <Clock size={12} color="var(--color-brand-primary)" />
            <span>{order.pickupTime?.replace('In ', '') || 'ASAP'}</span>
          </div>
        </div>

        {/* Customer & Timestamp Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: '#64748b',
            marginBottom: '1rem',
            paddingBottom: '0.65rem',
            borderBottom: '1px solid #f1f5f9'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600, color: '#334155' }}>
            <User size={13} />
            <span>{order.user?.name || 'Student'}</span>
          </span>
          <span>{formatTimeAgo(order.createdAt)}</span>
        </div>

        {/* 3. Items List (Quantity First) */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginBottom: '1.25rem'
          }}
        >
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
                fontSize: '0.96rem',
                lineHeight: 1.35
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  color: 'var(--color-brand-primary)',
                  backgroundColor: '#fff7ed',
                  padding: '0.05rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #ffedd5',
                  minWidth: '28px',
                  textAlign: 'center'
                }}
              >
                {item.quantity}×
              </span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {/* Special Instructions Note */}
        {order.specialInstructions && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              color: '#92400e',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.45rem'
            }}
          >
            <MessageSquare size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span><strong>Note:</strong> {order.specialInstructions}</span>
          </div>
        )}

        {/* 4. Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: 'auto',
            paddingTop: '0.85rem',
            borderTop: '1px solid #f1f5f9'
          }}
        >
          {/* Primary Action Button (Touch Target >= 44px) */}
          {nextStatus && (
            <button
              type="button"
              onClick={() => onUpdateStatus(order._id, nextStatus)}
              disabled={actionLoading}
              className="btn btn-primary"
              style={{
                flex: 1,
                minHeight: '44px',
                backgroundColor: actionBg,
                borderColor: actionBg,
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
              }}
              aria-label={`${actionLabel} for order ${order.token}`}
            >
              {actionLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ActionIcon size={16} />
              )}
              <span>{actionLoading ? 'Updating...' : actionLabel}</span>
            </button>
          )}

          {/* Secondary Reject Action (Available for PENDING & PREPARING) */}
          {(isPending || isPreparing) && onCancelClick && (
            <button
              type="button"
              onClick={() => onCancelClick(order)}
              disabled={actionLoading}
              className="btn btn-ghost"
              style={{
                minHeight: '44px',
                padding: '0 0.75rem',
                color: '#94a3b8',
                borderColor: '#cbd5e1'
              }}
              title="Cancel / Reject ticket"
              aria-label={`Cancel ticket ${order.token}`}
            >
              <XCircle size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
