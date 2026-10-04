import React from 'react';
import { CheckCircle2, Clock, ChefHat, PackageCheck, AlertCircle } from 'lucide-react';
import { ORDER_STEPS } from '../../utils/orderConstants';
import { formatTimeOnly } from '../../utils/formatters';

export const LiveStatusTimeline = ({ status = 'PENDING', order = null }) => {
  const currentStatus = (order?.status || status || 'PENDING').toUpperCase();

  if (currentStatus === 'CANCELLED') {
    const cancelTime = order?.cancelledAt ? formatTimeOnly(order.cancelledAt) : null;
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-status-cancelled-bg)',
          border: '1px solid var(--color-status-cancelled-border)',
          color: 'var(--color-status-cancelled)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          margin: '1.5rem 0'
        }}
      >
        <AlertCircle size={24} style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '1rem', margin: '0 0 0.2rem' }}>Order Cancelled</h4>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            {order?.cancelReason ? `Reason: ${order.cancelReason}` : 'This order was cancelled.'}
            {cancelTime && ` • Cancelled at ${cancelTime}`}
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = ORDER_STEPS.findIndex((s) => s.id === currentStatus);
  const safeIdx = currentIdx >= 0 ? currentIdx : 0;

  return (
    <div
      role="region"
      aria-label="Order Status Progress"
      style={{ margin: '2rem 0' }}
    >
      <ol
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          position: 'relative',
          gap: '0.5rem',
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}
      >
        {/* Progress Bar Background */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '22px',
            left: '12%',
            right: '12%',
            height: '4px',
            backgroundColor: 'var(--color-border)',
            zIndex: 1
          }}
        >
          <div
            style={{
              height: '100%',
              backgroundColor: 'var(--color-brand-primary)',
              width: `${(safeIdx / (ORDER_STEPS.length - 1)) * 100}%`,
              transition: 'width 0.4s ease'
            }}
          />
        </div>

        {ORDER_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isPassed = idx < safeIdx;
          const isCurrent = idx === safeIdx;
          const isFuture = idx > safeIdx;

          // Retrieve timestamp if available
          const rawTime = order ? order[step.timeKey] : null;
          const formattedTime = rawTime ? formatTimeOnly(rawTime) : null;

          const stepStatusText = isPassed
            ? `Completed ${formattedTime ? `at ${formattedTime}` : ''}`
            : isCurrent
            ? `Current Stage ${formattedTime ? `(since ${formattedTime})` : ''}`
            : 'Upcoming';

          return (
            <li
              key={step.id}
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`Step ${idx + 1}: ${step.label} - ${stepStatusText}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                zIndex: 2
              }}
            >
              {/* Step Circle */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCurrent
                    ? 'var(--color-brand-primary)'
                    : isPassed
                    ? 'var(--color-veg)'
                    : 'var(--color-surface)',
                  color: isCurrent || isPassed ? '#ffffff' : 'var(--color-text-muted)',
                  border: isFuture ? '2px solid var(--color-border)' : 'none',
                  boxShadow: isCurrent ? '0 0 0 5px var(--color-brand-light)' : 'none',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.5rem'
                }}
              >
                <Icon size={19} strokeWidth={isCurrent ? 2.5 : 2} />
              </div>

              {/* Step Label */}
              <span
                style={{
                  fontSize: 'clamp(0.72rem, 2.2vw, 0.86rem)',
                  fontWeight: isCurrent ? 800 : isPassed ? 700 : 500,
                  color: isCurrent
                    ? 'var(--color-brand-primary)'
                    : isPassed
                    ? 'var(--color-text-primary)'
                    : 'var(--color-text-muted)',
                  lineHeight: 1.2,
                  marginBottom: '0.15rem'
                }}
              >
                {step.label}
              </span>

              {/* Timestamp if available */}
              {formattedTime ? (
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: isCurrent ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)'
                  }}
                >
                  {formattedTime}
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--color-text-muted)',
                    display: 'none'
                  }}
                  className="step-desc"
                >
                  {step.desc}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <style>{`
        @media (min-width: 640px) {
          .step-desc { display: block !important; }
        }
      `}</style>
    </div>
  );
};
