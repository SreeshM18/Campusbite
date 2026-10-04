import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { PickupScheduler } from './PickupScheduler';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Utensils } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    itemCount
  } = useCart();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartDrawerOpen(false)}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-xl)',
          animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-raised)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--brand-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--brand-primary)'
              }}
            >
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Your Food Tray</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--nonveg-color)',
                  fontWeight: 600,
                  padding: '0.3rem 0.6rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="btn-ghost"
              style={{ padding: '0.4rem', borderRadius: '50%', color: 'var(--text-secondary)' }}
              aria-label="Close cart drawer"
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {cartItems.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                padding: '2rem 1rem'
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--surface-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem'
                }}
              >
                <Utensils size={32} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                Your tray is currently empty
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '280px' }}>
                Explore the canteen menu, pick your favorite dishes, and skip the counter wait.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/menu');
                }}
                className="btn btn-primary"
              >
                Explore Canteen Menu
              </button>
            </div>
          ) : (
            <>
              {/* Pickup Timing Selector */}
              <PickupScheduler />

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem',
                      padding: '0.85rem',
                      backgroundColor: 'var(--surface-raised)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.image || '/images/veg_biriyani.jpg'}
                      alt={item.name}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover',
                        flexShrink: 0
                      }}
                      onError={(e) => {
                        e.target.src = '/images/veg_biriyani.jpg';
                      }}
                    />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                        <span className={`diet-icon ${item.foodType === 'NON_VEG' ? 'non-veg' : 'veg'}`}></span>
                        <h4
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {item.name}
                        </h4>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        ₹{item.price} each
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        backgroundColor: 'var(--canvas)',
                        padding: '0.25rem 0.4rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        style={{ padding: '0.2rem', color: 'var(--text-primary)' }}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', minWidth: '18px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        style={{ padding: '0.2rem', color: 'var(--text-primary)' }}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Price & Remove */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--brand-primary)' }}>
                        ₹{item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeItem(item._id)}
                        style={{ color: 'var(--text-muted)', padding: '0.2rem' }}
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border)',
              backgroundColor: 'var(--surface-raised)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Item Total</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <div>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>To Pay</span>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--veg-color)', fontWeight: 600 }}>Zero Canteen Service Fee</span>
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-primary)' }}>₹{subtotal}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1.25rem',
                  fontWeight: 700
                }}
              >
                <span>Proceed to Checkout</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  ₹{subtotal} <ArrowRight size={18} />
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  navigate('/cart');
                }}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
              >
                View Full Cart Details
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
