import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../services/api';
import { PageContainer } from '../components/ui/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { FoodTypeIndicator } from '../components/ui/FoodTypeIndicator';
import { PickupScheduler } from '../components/cart/PickupScheduler';
import {
  ShoppingBag,
  Clock,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  UtensilsCrossed,
  ArrowLeft,
  Sparkles,
  Lock
} from 'lucide-react';

export const CheckoutPage = () => {
  const { cartItems, subtotal, pickupType, getFormattedPickupTime, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cartItems.length === 0) {
    return (
      <PageContainer size="narrow" paddingY="lg">
        <EmptyState
          icon={<ShoppingBag size={42} color="var(--color-brand-primary)" />}
          title="Your Food Tray is Empty"
          description="Please add delicious dishes from the canteen menu before proceeding to checkout."
          action={
            <Link to="/menu" className="btn btn-primary btn-lg">
              Explore Canteen Menu
            </Link>
          }
        />
      </PageContainer>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (loading) return; // Guard against double submissions

    try {
      setLoading(true);
      setErrorMsg('');

      const orderPayload = {
        items: cartItems.map((item) => ({
          menuItemId: item._id,
          quantity: item.quantity
        })),
        pickupType,
        pickupTime: getFormattedPickupTime(),
        paymentMethod,
        specialInstructions: specialInstructions.trim()
      };

      const res = await orderApi.createOrder(orderPayload);
      if (res.success && res.data) {
        // Clear cart ONLY after successful server creation
        clearCart();
        navigate(`/orders/${res.data._id}/success`, { state: { order: res.data } });
      } else {
        throw new Error(res.message || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      console.error('[Checkout Error]:', err);
      setErrorMsg(err.message || 'Order submission error. Please check dish availability.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer size="standard" paddingY="md">
      {/* 1. Serene Checkout Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Link
            to="/cart"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--color-text-muted)',
              fontSize: '0.84rem',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Cart</span>
          </Link>
          <span style={{ color: 'var(--color-border)' }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--color-veg)', fontWeight: 700 }}>
            <Lock size={12} /> Secure Campus Checkout
          </span>
        </div>

        <h1 className="type-h2" style={{ color: 'var(--color-text-primary)' }}>
          Review & Place Canteen Order
        </h1>
        <p className="type-body-lg" style={{ color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
          Confirm your meal details, choose pickup time, and generate your instant digital pickup token.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div
          className="card animate-fade-in"
          style={{
            backgroundColor: 'var(--color-danger-bg)',
            borderColor: '#fecaca',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--color-danger)',
            marginBottom: '1.75rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block', fontSize: '0.92rem' }}>Unable to complete order</strong>
            <span style={{ fontSize: '0.84rem' }}>{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Main 2-Column Form */}
      <form
        onSubmit={handlePlaceOrder}
        className="checkout-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '2rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Review, Schedule, Notes, Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Pickup Window Scheduler */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <PickupScheduler />
          </div>

          {/* Section 2: Ordered Items Review */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UtensilsCrossed size={18} color="var(--color-brand-primary)" />
                <h3 className="type-h4" style={{ color: 'var(--color-text-primary)' }}>
                  Dishes in this Order ({cartItems.length})
                </h3>
              </div>
              <Link to="/cart" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-brand-primary)', textDecoration: 'none' }}>
                Edit Tray
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--color-border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <FoodTypeIndicator isVeg={item.foodType === 'VEG'} size="sm" />
                    <div>
                      <strong style={{ fontSize: '0.94rem', color: 'var(--color-text-primary)', display: 'block' }}>
                        {item.name}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        ₹{item.price} × {item.quantity} qty
                      </span>
                    </div>
                  </div>

                  <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--color-text-primary)' }}>
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Special Instructions Input */}
            <div style={{ marginTop: '1.25rem' }}>
              <label
                htmlFor="special-notes"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.4rem'
                }}
              >
                <MessageSquare size={15} color="var(--color-brand-primary)" />
                <span>Special Kitchen Instructions (Optional)</span>
              </label>
              <input
                id="special-notes"
                type="text"
                placeholder="e.g. Less spicy, extra chutney, pack hot, etc."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="form-input"
                style={{
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-sunken)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.88rem'
                }}
              />
            </div>
          </div>

          {/* Section 3: Payment Selection & Simulation */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CreditCard size={18} color="var(--color-brand-primary)" />
                <h3 className="type-h4" style={{ color: 'var(--color-text-primary)' }}>
                  Payment Method
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: 'var(--color-brand-primary)',
                  backgroundColor: 'var(--color-brand-primary-subtle)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)'
                }}
              >
                Sandbox Simulation
              </span>
            </div>

            {/* Payment Method Selector Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.25rem'
              }}
              role="radiogroup"
              aria-label="Payment method choices"
            >
              {/* Option 1: Instant UPI */}
              <button
                type="button"
                role="radio"
                aria-checked={paymentMethod === 'UPI'}
                onClick={() => setPaymentMethod('UPI')}
                style={{
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'UPI' ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                  backgroundColor: paymentMethod === 'UPI' ? 'var(--color-brand-primary-subtle)' : 'var(--color-surface)',
                  color: paymentMethod === 'UPI' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <QrCode size={22} />
                <span>UPI / Instant QR</span>
              </button>

              {/* Option 2: Meal Card */}
              <button
                type="button"
                role="radio"
                aria-checked={paymentMethod === 'CARD'}
                onClick={() => setPaymentMethod('CARD')}
                style={{
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'CARD' ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                  backgroundColor: paymentMethod === 'CARD' ? 'var(--color-brand-primary-subtle)' : 'var(--color-surface)',
                  color: paymentMethod === 'CARD' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <CreditCard size={22} />
                <span>Campus Meal Card</span>
              </button>

              {/* Option 3: Pay at Counter */}
              <button
                type="button"
                role="radio"
                aria-checked={paymentMethod === 'CASH_AT_COUNTER'}
                onClick={() => setPaymentMethod('CASH_AT_COUNTER')}
                style={{
                  padding: '0.9rem',
                  borderRadius: 'var(--radius-md)',
                  border: paymentMethod === 'CASH_AT_COUNTER' ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                  backgroundColor: paymentMethod === 'CASH_AT_COUNTER' ? 'var(--color-brand-primary-subtle)' : 'var(--color-surface)',
                  color: paymentMethod === 'CASH_AT_COUNTER' ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <CheckCircle2 size={22} />
                <span>Pay at Counter #3</span>
              </button>
            </div>

            {/* Dynamic Sandbox UPI Information Card */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-sunken)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <QrCode size={44} color="var(--color-text-primary)" />
              </div>

              <div>
                <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Demo UPI Payment (Auto-Calculated Amount)
                </span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-brand-primary)', margin: '0.1rem 0' }}>
                  ₹{subtotal} INR
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  * Demo payment simulation for academic project evaluation. No real bank charges are debited.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Grand Total & Final Confirmation Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            className="card"
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <h3 className="type-h4" style={{ marginBottom: '1.15rem', color: 'var(--color-text-primary)' }}>
              Final Order Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
                <span>Subtotal ({cartItems.length} items)</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>₹{subtotal}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
                <span>Canteen Service Fee</span>
                <span style={{ color: 'var(--color-veg)', fontWeight: 700 }}>₹0 (FREE)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
                <span>Order Account</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{user?.name || 'Student'}</span>
              </div>
            </div>

            <div
              style={{
                borderTop: '1.5px dashed var(--color-border)',
                paddingTop: '1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}
            >
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                  Grand Total
                </span>
                <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                  Verified by server
                </span>
              </div>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                ₹{subtotal}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.9rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <Clock size={18} className="animate-spin" />
                  <span>Processing & Issuing Token...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Place Order (₹{subtotal})</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div
              style={{
                marginTop: '1.15rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="var(--color-veg)" />
                <span>Instant Digital Token CB-XXXX issued</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={14} color="var(--color-brand-primary)" />
                <span>Pickup at Central Food Court • Counter #3</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Responsive Layout Styles */}
      <style>{`
        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </PageContainer>
  );
};
