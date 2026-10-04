import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderApi, menuApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { PageContainer } from '../components/ui/PageContainer';
import { TokenBadge } from '../components/orders/TokenBadge';
import { LiveStatusTimeline } from '../components/orders/LiveStatusTimeline';
import { CancelOrderModal } from '../components/orders/CancelOrderModal';
import { getStatusMeta } from '../utils/orderConstants';
import { formatCurrency, formatFullDateTime, formatTimeAgo } from '../utils/formatters';
import {
  Clock,
  RefreshCw,
  ArrowLeft,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChefHat,
  Receipt,
  Sparkles,
  PackageCheck,
  CreditCard,
  MessageSquare,
  XCircle,
  RotateCcw,
  Loader2
} from 'lucide-react';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Cancellation Modal & Reorder
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchOrder = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else if (!order) setLoading(true);

      const res = await orderApi.getOrderById(id);
      if (res.success && res.data) {
        setOrder(res.data);
        if (res.data.token) {
          document.title = `Order ${res.data.token} · CampusBite`;
        }
      } else {
        throw new Error(res.message || 'Order record not found.');
      }
    } catch (err) {
      console.error('[Order Tracking Error]:', err);
      if (!order) {
        setError(err.message || 'Failed to fetch order details.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Smart polling: Poll every 12 seconds ONLY if order is in active state
    const interval = setInterval(() => {
      if (order && ['PENDING', 'PREPARING', 'READY'].includes(order.status)) {
        fetchOrder(true);
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [id, order?.status]);

  const handleCancelConfirm = async (orderId, reason) => {
    const res = await orderApi.cancelOrder(orderId, reason);
    if (res.success) {
      showToast('Your pre-order has been cancelled.', 'success');
      fetchOrder(true);
    } else {
      throw new Error(res.message || 'Failed to cancel order.');
    }
  };

  const handleReorder = async () => {
    if (!order) return;
    try {
      setReordering(true);
      const menuRes = await menuApi.getMenu();
      const liveItems = menuRes.data || [];
      const liveItemMap = new Map(liveItems.map((item) => [item._id.toString(), item]));

      let addedCount = 0;
      const unavailableNames = [];

      for (const orderItem of order.items || []) {
        const menuItemId = (orderItem.menuItem?._id || orderItem.menuItem || '').toString();
        const liveItem = liveItemMap.get(menuItemId);

        if (liveItem && liveItem.available) {
          addItem(liveItem, orderItem.quantity || 1);
          addedCount += (orderItem.quantity || 1);
        } else {
          unavailableNames.push(orderItem.name);
        }
      }

      if (addedCount > 0) {
        if (unavailableNames.length > 0) {
          showToast(`Added available items. Note: "${unavailableNames.join(', ')}" is currently sold out.`, 'warning');
        } else {
          showToast('Dishes added to your food tray!', 'success');
        }
        navigate('/cart');
      } else {
        showToast('These items aren’t available right now. Please check today\'s menu.', 'warning');
      }
    } catch (err) {
      console.error('[Reorder Error]:', err);
      showToast('Could not reorder dishes. Please try again.', 'error');
    } finally {
      setReordering(false);
    }
  };

  if (loading) {
    return (
      <PageContainer size="narrow" paddingY="lg">
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <RefreshCw size={36} className="animate-spin" color="var(--color-brand-primary)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Connecting to live canteen kitchen status...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (error || !order) {
    return (
      <PageContainer size="narrow" paddingY="lg">
        <div
          className="card"
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)'
          }}
        >
          <AlertCircle size={36} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h2 className="type-h3" style={{ marginBottom: '0.5rem' }}>Unable to find order</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
            {error || 'This order does not exist or you do not have permission to view it.'}
          </p>
          <Link to="/orders" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
            Return to My Orders
          </Link>
        </div>
      </PageContainer>
    );
  }

  const meta = getStatusMeta(order.status);
  const StatusIcon = meta.icon;
  const isPending = order.status === 'PENDING';
  const isReady = order.status === 'READY';
  const isCompleted = order.status === 'COMPLETED';
  const isCancelled = order.status === 'CANCELLED';

  return (
    <PageContainer size="narrow" paddingY="lg">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1050,
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: toastMessage.type === 'success' ? '#15803d' : toastMessage.type === 'warning' ? '#d97706' : '#1e293b',
            color: '#ffffff',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* 1. Back Link & Actions Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem'
        }}
      >
        <Link
          to="/orders"
          className="btn btn-ghost btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-text-secondary)',
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Orders</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isPending && (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="btn btn-secondary btn-sm"
              style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-bg)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <XCircle size={14} />
              <span>Cancel Order</span>
            </button>
          )}

          {!isCompleted && !isCancelled && (
            <button
              type="button"
              onClick={() => fetchOrder(true)}
              disabled={refreshing}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              aria-label="Refresh order status"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Updating...' : 'Live Refresh'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Live Tracking Card */}
      <div
        className="card"
        style={{
          padding: '2rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-surface)',
          border: isReady ? '2px solid var(--color-status-ready)' : '1px solid var(--color-border)',
          boxShadow: isReady ? '0 8px 24px -4px rgba(22, 163, 74, 0.22)' : 'var(--shadow-sm)',
          marginBottom: '1.75rem'
        }}
      >
        {/* Order Identifier & Status */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            paddingBottom: '1.25rem',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Canteen Pre-Order Tracker
            </span>
            <h1 className="type-h3" style={{ color: 'var(--color-text-primary)', margin: '0.2rem 0 0' }}>
              Order #{order.token}
            </h1>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: meta.bgColor,
              border: `1px solid ${meta.borderColor}`,
              color: meta.color,
              fontWeight: 700,
              fontSize: '0.86rem'
            }}
          >
            <StatusIcon size={15} />
            <span>• {meta.badgeText}</span>
          </div>
        </div>

        {/* 4-Step Visual Timeline with actual stage timestamps */}
        <LiveStatusTimeline status={order.status} order={order} />

        {/* Dynamic Contextual Callout Banner */}
        <div
          style={{
            backgroundColor: meta.bgColor,
            border: `1px solid ${meta.borderColor}`,
            color: meta.color,
            borderRadius: 'var(--radius-lg)',
            padding: '1.15rem 1.35rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            margin: '1.75rem 0'
          }}
        >
          <StatusIcon size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.98rem', marginBottom: '0.2rem' }}>
              {meta.label}
            </strong>
            <p style={{ fontSize: '0.86rem', margin: 0, opacity: 0.95 }}>
              {meta.desc}
            </p>
          </div>
        </div>

        {/* Perforated Official Canteen Token Badge */}
        <TokenBadge token={order.token} pickupTime={order.pickupTime} />
      </div>

      {/* 3. Itemized Receipt Card */}
      <div
        className="card"
        style={{
          padding: '1.75rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          marginBottom: '1.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Receipt size={18} color="var(--color-brand-primary)" />
          <h3 className="type-h4" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
            Itemized Order Receipt
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid var(--color-border-subtle)'
              }}
            >
              <div>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)', display: 'block', fontSize: '0.92rem' }}>
                  {item.name}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {formatCurrency(item.price)} × {item.quantity} qty
                </span>
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-text-primary)' }}>
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {order.specialInstructions && (
          <div
            style={{
              padding: '0.85rem',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '1.25rem',
              display: 'flex',
              gap: '0.5rem'
            }}
          >
            <MessageSquare size={16} color="var(--color-brand-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span><strong>Kitchen Notes:</strong> {order.specialInstructions}</span>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '1rem',
            borderTop: '1px dashed var(--color-border)',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}
        >
          <span>Total Paid</span>
          <span style={{ color: 'var(--color-brand-primary)' }}>
            {formatCurrency(order.subtotal || order.totalAmount)}
          </span>
        </div>
      </div>

      {/* 4. Order Information & Handover Desk */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-xl)',
          backgroundColor: 'var(--color-surface-subtle)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontSize: '0.86rem',
          color: 'var(--color-text-secondary)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Order Placed:</span>
          <strong style={{ color: 'var(--color-text-primary)' }}>{formatFullDateTime(order.createdAt)}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Pickup Window:</span>
          <strong style={{ color: 'var(--color-text-primary)' }}>{order.pickupTime}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Payment Mode:</span>
          <strong style={{ color: 'var(--color-text-primary)' }}>Demo UPI (Academic Sandbox)</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Handover Desk:</span>
          <strong style={{ color: 'var(--color-text-primary)' }}>Central Food Court — Counter #3</strong>
        </div>
      </div>

      {/* 5. Footer Action: Order Again */}
      {isCompleted && (
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={handleReorder}
            disabled={reordering}
            className="btn btn-primary btn-lg"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.85rem 2rem'
            }}
          >
            {reordering ? <Loader2 size={18} className="animate-spin" /> : <RotateCcw size={18} />}
            <span>{reordering ? 'Adding to Food Tray...' : 'Order Again'}</span>
          </button>
        </div>
      )}

      {/* Cancel Order Modal */}
      <CancelOrderModal
        order={order}
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirmCancel={handleCancelConfirm}
      />
    </PageContainer>
  );
};
