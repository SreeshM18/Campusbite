import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { orderApi } from '../services/api';
import { PageContainer } from '../components/ui/PageContainer';
import { TokenBadge } from '../components/orders/TokenBadge';
import { FoodTypeIndicator } from '../components/ui/FoodTypeIndicator';
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  Utensils,
  RefreshCw,
  MapPin,
  Receipt,
  Sparkles
} from 'lucide-react';

export const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    // Subtle single-burst celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // Fallback if canvas-confetti is not loaded
    }

    // If order was not passed in location state (e.g. on direct navigation or page refresh), fetch it from backend
    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const res = await orderApi.getOrderById(id);
          if (res.success && res.data) {
            setOrder(res.data);
          }
        } catch (err) {
          console.error('[Order Success Fetch Error]:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <PageContainer size="narrow" paddingY="lg">
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <RefreshCw size={32} className="animate-spin" color="var(--color-brand-primary)" style={{ margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Retrieving official canteen pickup token...
          </p>
        </div>
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer size="narrow" paddingY="lg">
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <h2 className="type-h3" style={{ marginBottom: '0.5rem' }}>Order record not found</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            We could not locate this order ticket. Check your order history.
          </p>
          <Link to="/orders" className="btn btn-primary">
            View My Orders
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer size="narrow" paddingY="md">
      {/* 1. Success Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-veg-bg)',
            color: 'var(--color-veg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            border: '2px solid var(--color-veg-border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <CheckCircle2 size={38} strokeWidth={2.5} />
        </div>

        <h1 className="type-h2" style={{ color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
          Order Confirmed!
        </h1>
        <p className="type-body-lg" style={{ color: 'var(--color-text-secondary)' }}>
          Your meal has been dispatched to the canteen kitchen queue.
        </p>
      </div>

      {/* 2. Prominent Official Canteen Token Badge */}
      <div style={{ marginBottom: '2rem' }}>
        <TokenBadge token={order.token} pickupTime={order.pickupTime} />
      </div>

      {/* 3. Location & Pickup Details Card */}
      <div
        className="card"
        style={{
          padding: '1.25rem 1.5rem',
          backgroundColor: 'var(--color-surface-sunken)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-brand-primary-subtle)',
            color: 'var(--color-brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <MapPin size={22} />
        </div>
        <div>
          <strong style={{ display: 'block', fontSize: '0.94rem', color: 'var(--color-text-primary)' }}>
            Handover Location: Central Food Court • Counter #3
          </strong>
          <span style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            Scheduled Window: <strong style={{ color: 'var(--color-brand-primary)' }}>{order.pickupTime}</strong>
          </span>
        </div>
      </div>

      {/* 4. Order Summary Receipt Card */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-raised)',
          marginBottom: '2rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.85rem',
            marginBottom: '1rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Order Reference
            </span>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
              #{order._id?.slice(-8).toUpperCase()}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Payment Status
            </span>
            <div style={{ color: 'var(--color-veg)', fontWeight: 700, fontSize: '0.92rem' }}>
              ✓ {order.paymentStatus} ({order.paymentMethod})
            </div>
          </div>
        </div>

        {/* Item List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
          {order.items?.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.92rem'
              }}
            >
              <span style={{ color: 'var(--color-text-primary)' }}>
                {item.quantity} × {item.name}
              </span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {order.specialInstructions && (
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '1rem',
              border: '1px solid var(--color-border-subtle)'
            }}
          >
            <strong>Note for Chef:</strong> {order.specialInstructions}
          </div>
        )}

        {/* Total */}
        <div
          style={{
            borderTop: '1px dashed var(--color-border)',
            paddingTop: '0.85rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-text-primary)' }}>
            Total Paid
          </span>
          <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--color-brand-primary)' }}>
            ₹{order.subtotal}
          </span>
        </div>
      </div>

      {/* 5. Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        <Link
          to={`/orders/${order._id}`}
          className="btn btn-primary btn-lg"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Clock size={18} />
          <span>Track Live Kitchen Status</span>
        </Link>

        <Link
          to="/menu"
          className="btn btn-secondary btn-lg"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Utensils size={18} />
          <span>Order More Dishes</span>
        </Link>
      </div>
    </PageContainer>
  );
};
