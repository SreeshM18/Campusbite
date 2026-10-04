import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PageContainer } from '../components/ui/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { FoodTypeIndicator } from '../components/ui/FoodTypeIndicator';
import { PickupScheduler } from '../components/cart/PickupScheduler';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Utensils,
  Clock,
  ShieldCheck,
  Zap,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    itemCount,
    getFormattedPickupTime
  } = useCart();
  const navigate = useNavigate();

  const maxPrepTime = cartItems.reduce(
    (max, item) => Math.max(max, item.preparationTime || 10),
    10
  );

  if (cartItems.length === 0) {
    return (
      <PageContainer size="standard" paddingY="lg">
        <EmptyState
          icon={<ShoppingBag size={42} color="var(--color-brand-primary)" />}
          title="Your Food Tray is Empty"
          description="You haven't added any dishes yet. Explore our freshly prepared campus tiffin, hot meals, cool juices, and quick snacks!"
          action={
            <Link to="/menu" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Utensils size={18} />
              <span>Explore Canteen Menu</span>
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer size="standard" paddingY="md">
      {/* 1. Header Row */}
      <div
        style={{
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--color-brand-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.25rem'
            }}
          >
            <Sparkles size={14} />
            <span>Order Review & Schedule</span>
          </div>
          <h1 className="type-h2" style={{ color: 'var(--color-text-primary)' }}>
            Your Food Tray ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/menu"
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ArrowLeft size={15} />
            <span>Add More Dishes</span>
          </Link>

          <button
            type="button"
            onClick={clearCart}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--color-danger)', fontWeight: 600 }}
            aria-label="Clear all items from tray"
          >
            Clear Tray
          </button>
        </div>
      </div>

      {/* 2. Main 2-Column Responsive Layout */}
      <div
        className="cart-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '2rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            className="card"
            style={{
              padding: '0.5rem 1.25rem',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }}
          >
            {cartItems.map((item, index) => {
              const isLast = index === cartItems.length - 1;
              const itemTotal = item.price * item.quantity;
              const isVeg = item.foodType === 'VEG';

              return (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '1.15rem 0',
                    borderBottom: isLast ? 'none' : '1px solid var(--color-border-subtle)'
                  }}
                >
                  {/* Item Image & Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 240px' }}>
                    <img
                      src={item.image || '/images/veg_biriyani.jpg'}
                      alt={item.name}
                      style={{
                        width: '68px',
                        height: '68px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover',
                        flexShrink: 0,
                        backgroundColor: 'var(--color-surface-subtle)'
                      }}
                      onError={(e) => {
                        e.target.src = '/images/veg_biriyani.jpg';
                      }}
                    />

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                        <FoodTypeIndicator isVeg={isVeg} size="sm" />
                        <h3
                          style={{
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            color: 'var(--color-text-primary)',
                            lineHeight: 1.2
                          }}
                        >
                          {item.name}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                          ₹{item.price} each
                        </span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={12} /> ~{item.preparationTime || 10}m prep
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls & Subtotal */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    {/* Stepper */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        backgroundColor: 'var(--color-surface-sunken)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--color-border)'
                      }}
                      role="group"
                      aria-label={`Quantity for ${item.name}`}
                    >
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        aria-label={`Decrease ${item.name} quantity`}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Minus size={13} />
                      </button>

                      <span
                        style={{
                          minWidth: '22px',
                          textAlign: 'center',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          color: 'var(--color-text-primary)'
                        }}
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        aria-label={`Increase ${item.name} quantity`}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-brand-primary)',
                          border: 'none',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div style={{ textAlign: 'right', minWidth: '70px' }}>
                      <span
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: 'var(--color-text-primary)'
                        }}
                      >
                        ₹{itemTotal}
                      </span>
                    </div>

                    {/* Remove Action */}
                    <button
                      type="button"
                      onClick={() => removeItem(item._id)}
                      aria-label={`Remove ${item.name} from tray`}
                      style={{
                        padding: '0.4rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-muted)',
                        cursor: 'pointer',
                        transition: 'color var(--transition-fast)'
                      }}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Pickup Notice Card */}
          <div
            className="card"
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <Zap size={20} color="var(--color-brand-primary)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.84rem', color: 'var(--color-text-secondary)' }}>
              <strong>Zero Standing Lines:</strong> Your kitchen token will be prepared in order. You will receive real-time notification on token board Counter #3 when it&apos;s packed.
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary & Checkout Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Pickup Window Scheduler Component */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <PickupScheduler />
          </div>

          {/* Bill Summary Card */}
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
            <h3 className="type-h4" style={{ marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
              Order Bill Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
                <span>Dishes Subtotal ({itemCount} items)</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>₹{subtotal}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--color-text-secondary)' }}>
                <span>Campus Canteen Convenience</span>
                <span style={{ color: 'var(--color-veg)', fontWeight: 700 }}>₹0 (FREE)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                <span>Estimated Batch Prep Time</span>
                <span>~{maxPrepTime} mins</span>
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
                  Total Amount
                </span>
                <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                  Inclusive of all canteen preparation
                </span>
              </div>
              <span style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                ₹{subtotal}
              </span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '1rem'
              }}
            >
              <span>Proceed to Checkout</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                ₹{subtotal} <ArrowRight size={18} />
              </span>
            </button>

            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontSize: '0.78rem',
                color: 'var(--color-text-muted)'
              }}
            >
              <ShieldCheck size={14} color="var(--color-veg)" />
              <span>Campus Verified • No hidden charges</span>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </PageContainer>
  );
};
