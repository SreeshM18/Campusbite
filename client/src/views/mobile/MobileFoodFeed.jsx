import React from 'react';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, Star, Clock, Flame } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const MobileFoodFeed = ({ dishes = [], title = 'Recommended For You' }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();

  const getItemQuantity = (id) => {
    const item = cartItems.find((i) => (i._id || i.id) === id);
    return item ? item.quantity : 0;
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
          {title}
        </h3>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          {dishes.length} options
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {dishes.map((dish) => {
          const id = dish._id || dish.id;
          const qty = getItemQuantity(id);
          const isVeg = dish.dietary === 'veg' || dish.isVeg;

          return (
            <div
              key={id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem',
                backgroundColor: 'var(--surface)',
                borderRadius: 'var(--radius-lg, 16px)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xs)',
                gap: '0.85rem'
              }}
            >
              {/* Left Details */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {/* Veg / Non-veg symbol */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      border: `1.5px solid ${isVeg ? '#10B981' : '#EF4444'}`,
                      borderRadius: '3px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isVeg ? '#10B981' : '#EF4444'
                      }}
                    />
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {dish.category || 'Special'}
                  </span>
                </div>

                {/* Dish Name */}
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {dish.name}
                </div>

                {/* Rating & Prep Time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.75rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontWeight: 700 }}>
                    <Star size={12} fill="#f59e0b" /> {dish.rating || 4.8}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--text-secondary)' }}>
                    <Clock size={12} /> {dish.prepTime || 12}m
                  </span>
                </div>

                {/* Price */}
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--brand-primary)', marginTop: '0.1rem' }}>
                  {formatCurrency(dish.price)}
                </div>
              </div>

              {/* Right Image + Add Button Container */}
              <div
                style={{
                  position: 'relative',
                  width: '92px',
                  height: '92px',
                  flexShrink: 0
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9'
                  }}
                >
                  <img
                    src={dish.imageUrl || '/images/south_indian_thali.jpg'}
                    alt={dish.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = '/images/south_indian_thali.jpg';
                    }}
                  />
                </div>

                {/* Action Button */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '82px'
                  }}
                >
                  {qty === 0 ? (
                    <button
                      type="button"
                      onClick={() => addToCart(dish, 1)}
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--brand-primary)',
                        border: '1px solid var(--brand-primary)',
                        borderRadius: '8px',
                        padding: '0.35rem 0',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                      }}
                    >
                      ADD <Plus size={13} />
                    </button>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        backgroundColor: 'var(--brand-primary)',
                        color: '#ffffff',
                        borderRadius: '8px',
                        padding: '0.25rem 0.4rem',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 4px 10px rgba(255, 107, 0, 0.35)'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateQuantity(id, qty - 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          padding: 0
                        }}
                      >
                        <Minus size={13} />
                      </button>
                      <span>{qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(id, qty + 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          padding: 0
                        }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileFoodFeed;
