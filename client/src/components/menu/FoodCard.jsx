import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FoodTypeIndicator } from '../ui/FoodTypeIndicator';
import { Clock, Plus, Minus, UtensilsCrossed, Sparkles } from 'lucide-react';

/**
 * CampusBite Master Food Card Component
 * Food-first scanning hierarchy with authentic dietary geometry, price clarity,
 * preparation time metadata, and smooth Add-to-Stepper interaction.
 */
export const FoodCard = ({ item }) => {
  const { cartItems, addItem, updateQuantity } = useCart();
  const [imageError, setImageError] = useState(false);

  const cartItem = cartItems?.find((i) => i._id === item._id);
  const quantity = cartItem ? cartItem.quantity : 0;
  const isAvailable = item.available !== false;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addItem(item, 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;
    updateQuantity(item._id, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(item._id, Math.max(0, quantity - 1));
  };

  return (
    <article
      className="card food-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-xs)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal)',
        opacity: isAvailable ? 1 : 0.78,
        overflow: 'hidden'
      }}
    >
      {/* Food Image Container (4:3 ratio) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 3',
          backgroundColor: 'var(--color-surface-subtle)',
          overflow: 'hidden'
        }}
      >
        {!imageError && item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          /* Graceful Fallback for missing/broken images */
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--color-surface-subtle)',
              color: 'var(--color-text-muted)',
              gap: '0.4rem',
              padding: '1rem',
              textAlign: 'center'
            }}
          >
            <UtensilsCrossed size={32} strokeWidth={1.5} color="var(--color-brand-primary)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {item.name}
            </span>
          </div>
        )}

        {/* Dietary Marker Badge */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <FoodTypeIndicator isVeg={item.foodType !== 'NON_VEG'} size="sm" showLabel={true} />
        </div>

        {/* Featured / Quick Pick Tag */}
        {item.featured && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 2,
              backgroundColor: 'var(--color-brand-secondary)',
              color: '#ffffff',
              fontSize: '0.70rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            <Sparkles size={11} color="var(--accent)" />
            <span>Quick Pick</span>
          </div>
        )}

        {/* Sold Out Watermark Overlay */}
        {!isAvailable && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(27, 31, 43, 0.72)',
              backdropFilter: 'blur(2px)',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              gap: '4px'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              Sold Out Today
            </span>
            <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Fresh batch tomorrow</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '1.15rem',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
          gap: '0.85rem'
        }}
      >
        <div>
          {/* Header row: Dish name & Price */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '0.5rem',
              marginBottom: '0.4rem'
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
                lineHeight: 1.25,
                margin: 0,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
              title={item.name}
            >
              {item.name}
            </h3>

            <div className="type-price" style={{ color: 'var(--color-text-primary)' }}>
              <span className="type-price-currency">₹</span>
              <span>{item.price}</span>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <p
              style={{
                fontSize: '0.84rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.45,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                margin: 0
              }}
            >
              {item.description}
            </p>
          )}
        </div>

        {/* Footer Meta & Action Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: '0.75rem',
            marginTop: 'auto'
          }}
        >
          {/* Prep Time */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              fontWeight: 500
            }}
          >
            <Clock size={13} color="var(--color-brand-primary)" />
            <span>{item.preparationTime ? `${item.preparationTime} mins` : '10-15 mins'}</span>
          </div>

          {/* Action Trigger: Add vs Quantity Stepper */}
          {!isAvailable ? (
            <button
              disabled
              className="btn btn-sm btn-outline"
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 0.75rem',
                minHeight: '38px',
                opacity: 0.6
              }}
              aria-label={`${item.name} is currently sold out`}
            >
              Sold Out
            </button>
          ) : quantity > 0 ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-brand-light)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-brand-primary)',
                padding: '2px 4px',
                gap: '2px',
                boxShadow: 'var(--shadow-xs)',
                minHeight: '38px'
              }}
              role="group"
              aria-label={`Quantity for ${item.name}`}
            >
              <button
                type="button"
                onClick={handleDecrement}
                className="focus-ring"
                style={{
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--color-brand-primary)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
                aria-label={`Decrease ${item.name} quantity`}
                title="Decrease quantity"
              >
                <Minus size={15} strokeWidth={2.5} />
              </button>

              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  color: 'var(--color-brand-primary)',
                  minWidth: '24px',
                  textAlign: 'center',
                  fontVariantNumeric: 'tabular-nums'
                }}
                aria-live="polite"
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                className="focus-ring"
                style={{
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-xs)',
                  color: '#ffffff',
                  backgroundColor: 'var(--color-brand-primary)',
                  border: 'none',
                  cursor: 'pointer'
                }}
                aria-label={`Increase ${item.name} quantity`}
                title="Increase quantity"
              >
                <Plus size={15} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              className="btn btn-primary btn-sm focus-ring"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                minHeight: '38px',
                borderRadius: 'var(--radius-md)'
              }}
              aria-label={`Add ${item.name} to tray`}
            >
              <Plus size={15} strokeWidth={2.5} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>

      <style>{`
        @media (hover: hover) and (pointer: fine) {
          .food-card:hover img {
            transform: scale(1.05);
          }
        }
      `}</style>
    </article>
  );
};
