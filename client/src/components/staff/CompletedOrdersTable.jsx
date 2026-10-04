import React from 'react';
import { getStatusMeta } from '../../utils/orderConstants';
import { formatCurrency, formatFullDateTime, summarizeItems } from '../../utils/formatters';
import { CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';

export const CompletedOrdersTable = ({ orders = [] }) => {
  if (!orders || orders.length === 0) {
    return (
      <div
        style={{
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px dashed #cbd5e1'
        }}
      >
        <ShoppingBag size={32} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.35rem' }}>
          No Completed Orders Today
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>
          Orders fulfilled at Counter #3 will be logged here for the day.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid #cbd5e1',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <th style={{ padding: '0.85rem 1.25rem' }}>Token</th>
              <th style={{ padding: '0.85rem 1rem' }}>Customer</th>
              <th style={{ padding: '0.85rem 1rem' }}>Items Prepared</th>
              <th style={{ padding: '0.85rem 1rem' }}>Total</th>
              <th style={{ padding: '0.85rem 1rem' }}>Placed Time</th>
              <th style={{ padding: '0.85rem 1rem' }}>Completed At</th>
              <th style={{ padding: '0.85rem 1.25rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => {
              const meta = getStatusMeta(order.status);
              const StatusIcon = meta.icon;
              return (
                <tr
                  key={order._id || idx}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    transition: 'background-color 0.1s ease'
                  }}
                >
                  {/* Token */}
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        color: 'var(--color-brand-primary)',
                        backgroundColor: '#fff7ed',
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #ffedd5'
                      }}
                    >
                      {order.token}
                    </span>
                  </td>

                  {/* Customer */}
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#1e293b' }}>
                    {order.user?.name || 'Student'}
                  </td>

                  {/* Items */}
                  <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                    {summarizeItems(order.items, 3)}
                  </td>

                  {/* Total */}
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                    {formatCurrency(order.subtotal || order.totalAmount)}
                  </td>

                  {/* Placed Time */}
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>
                    {formatFullDateTime(order.createdAt)}
                  </td>

                  {/* Completed / Ready Timestamp */}
                  <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.82rem' }}>
                    {order.completedAt ? formatFullDateTime(order.completedAt) : order.cancelledAt ? formatFullDateTime(order.cancelledAt) : '—'}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
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
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
