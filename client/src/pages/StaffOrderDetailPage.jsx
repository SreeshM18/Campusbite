import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StaffShell } from '../components/layout/StaffShell';
import { StaffCancelModal } from '../components/staff/StaffCancelModal';
import { orderApi } from '../services/api';
import { getStatusMeta } from '../utils/orderConstants';
import { formatCurrency, formatFullDateTime, formatTimeAgo } from '../utils/formatters';
import {
  ArrowLeft,
  Clock,
  ChefHat,
  CheckCircle2,
  PackageCheck,
  User,
  CreditCard,
  MessageSquare,
  AlertCircle,
  XCircle,
  Loader2,
  Calendar,
  ShieldAlert
} from 'lucide-react';

export const StaffOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await orderApi.getOrderById(id);
      if (res.success && res.data) {
        setOrder(res.data);
      } else {
        setError('Order not found or inaccessible.');
      }
    } catch (err) {
      console.error('Failed to load order:', err);
      setError(err.message || 'Failed to retrieve order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const handleUpdateStatus = async (nextStatus) => {
    try {
      setActionLoading(true);
      const res = await orderApi.updateOrderStatus(order._id, nextStatus);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmCancel = async (orderId, reason) => {
    try {
      const res = await orderApi.cancelOrder(orderId, reason);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      alert(`Cancellation failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <StaffShell>
        <div style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
          <div>Loading kitchen order details...</div>
        </div>
      </StaffShell>
    );
  }

  if (error || !order) {
    return (
      <StaffShell>
        <div
          style={{
            maxWidth: '600px',
            margin: '3rem auto',
            padding: '2rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #cbd5e1',
            textAlign: 'center'
          }}
        >
          <AlertCircle size={40} color="#dc2626" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            {error || 'Order Not Found'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            We could not find the requested order in the kitchen database.
          </p>
          <Link to="/staff/orders" className="btn btn-primary">
            <ArrowLeft size={16} /> Return to Kitchen Queue
          </Link>
        </div>
      </StaffShell>
    );
  }

  const meta = getStatusMeta(order.status);
  const StatusIcon = meta.icon;

  const isPending = order.status === 'PENDING';
  const isPreparing = order.status === 'PREPARING';
  const isReady = order.status === 'READY';
  const isCompleted = order.status === 'COMPLETED';
  const isCancelled = order.status === 'CANCELLED';

  return (
    <StaffShell>
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            to="/staff/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: '#475569',
              fontSize: '0.88rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={16} /> Back to Live Kitchen Queue
          </Link>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Order ID: <code style={{ fontFamily: 'var(--font-mono)' }}>{order._id}</code>
          </span>
        </div>

        {/* Top Header Card */}
        <div
          className="card"
          style={{
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #cbd5e1',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.35rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '2.2rem',
                  fontWeight: 900,
                  color: '#0f172a',
                  letterSpacing: '0.04em'
                }}
              >
                {order.token}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: meta.bgColor,
                  color: meta.color,
                  border: `1px solid ${meta.borderColor}`,
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                <StatusIcon size={14} />
                <span>{meta.badgeText}</span>
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={14} />
              <span>Placed {formatTimeAgo(order.createdAt)} ({formatFullDateTime(order.createdAt)})</span>
            </div>
          </div>

          {/* Quick Action Transition Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isPending && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('PREPARING')}
                disabled={actionLoading}
                className="btn btn-primary"
                style={{ backgroundColor: '#2563eb', borderColor: '#2563eb', minHeight: '44px' }}
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <ChefHat size={16} />}
                <span>Start Preparing</span>
              </button>
            )}

            {isPreparing && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('READY')}
                disabled={actionLoading}
                className="btn btn-primary"
                style={{ backgroundColor: '#16a34a', borderColor: '#16a34a', minHeight: '44px' }}
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                <span>Mark Ready at Counter #3</span>
              </button>
            )}

            {isReady && (
              <button
                type="button"
                onClick={() => handleUpdateStatus('COMPLETED')}
                disabled={actionLoading}
                className="btn btn-secondary"
                style={{ minHeight: '44px' }}
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <PackageCheck size={16} />}
                <span>Complete Handover</span>
              </button>
            )}

            {(isPending || isPreparing) && (
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                disabled={actionLoading}
                className="btn btn-ghost"
                style={{ color: '#dc2626', borderColor: '#fca5a5', minHeight: '44px' }}
              >
                <XCircle size={16} />
                <span>Reject / Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Left Column: Items to Prepare */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid #cbd5e1'
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', paddingBottom: '0.65rem', borderBottom: '1px solid #f1f5f9' }}>
              Kitchen Items Checklist
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        color: 'var(--color-brand-primary)',
                        backgroundColor: '#fff7ed',
                        padding: '0.1rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #ffedd5'
                      }}
                    >
                      {item.quantity}×
                    </span>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>
                        {item.name}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Unit Price: {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                  <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                    {formatCurrency(item.price * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>

            {order.specialInstructions && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.85rem 1rem',
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fef3c7',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  color: '#92400e',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.5rem'
                }}
              >
                <MessageSquare size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Student Preparation Note:</strong>
                  <div style={{ marginTop: '0.2rem' }}>{order.specialInstructions}</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Operational Audit & Timestamps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Customer & Pickup Info Card */}
            <div
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid #cbd5e1'
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                Customer & Pickup Info
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Customer Name</span>
                  <strong style={{ color: '#0f172a' }}>{order.user?.name || 'Student'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Campus Email</span>
                  <span style={{ color: '#334155' }}>{order.user?.email || 'student@campusbite.edu'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Pickup Window</span>
                  <strong style={{ color: 'var(--color-brand-primary)' }}>{order.pickupTime || 'ASAP (Immediate)'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Designated Counter</span>
                  <strong style={{ color: '#0f172a' }}>Central Canteen Counter #3</strong>
                </div>
              </div>
            </div>

            {/* Operational Status Timestamps Card */}
            <div
              className="card"
              style={{
                padding: '1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid #cbd5e1'
              }}
            >
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                Audit Timestamps
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.84rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#64748b' }}>Order Received</span>
                  <span>{formatFullDateTime(order.createdAt)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#64748b' }}>Cooking Started</span>
                  <span>{order.preparingAt ? formatFullDateTime(order.preparingAt) : '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#64748b' }}>Marked Ready</span>
                  <span>{order.readyAt ? formatFullDateTime(order.readyAt) : '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.4rem' }}>
                  <span style={{ color: '#64748b' }}>Handover Completed</span>
                  <span>{order.completedAt ? formatFullDateTime(order.completedAt) : '—'}</span>
                </div>
                {order.cancelledAt && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                    <span>Cancelled At</span>
                    <span>{formatFullDateTime(order.cancelledAt)} ({order.cancelReason})</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Staff Rejection Modal */}
      {cancelModalOpen && (
        <StaffCancelModal
          order={order}
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirmCancel={handleConfirmCancel}
        />
      )}
    </StaffShell>
  );
};
