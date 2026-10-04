import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, Star, Heart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

/**
 * MobileFloatingCard — Signature Marvis Dosa Foodie App UI Kit Card
 * Features a circular food dish floating smoothly above an elevated white capsule card with orange price highlight.
 */
export const MobileFloatingCard = ({ dish }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  const id = dish._id || dish.id;
  const currentItem = cartItems.find((i) => (i._id || i.id) === id);
  const qty = currentItem ? currentItem.quantity : 0;

  return (
    <div
      style={{
        position: 'relative',
        paddingTop: '48px', // Space for the top floating circular plate
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* 1. Floating Circular Dish Plate */}
      <div
        style={{
          position: 'absolute',
          top: '0px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.22)',
          border: '3px solid #ffffff',
          backgroundColor: '#ffffff',
          zIndex: 10,
          transition: 'transform 0.3s ease'
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

      {/* 2. Elevated Capsule Card Body */}
      <div
        style={{
          width: '100%',
          backgroundColor: 'var(--surface, #ffffff)',
          borderRadius: '26px',
          padding: '62px 14px 16px 14px',
          boxShadow: '0 18px 36px -8px rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--border, #f1f5f9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '0.4rem',
          position: 'relative',
          minHeight: '190px'
        }}
      >
        {/* Heart Favorite Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            color: isLiked ? '#FA4A0C' : 'var(--text-muted, #94a3b8)',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex'
          }}
          aria-label="Favorite"
        >
          <Heart size={16} fill={isLiked ? '#FA4A0C' : 'none'} />
        </button>

        {/* Dish Title */}
        <div
          style={{
            fontWeight: 800,
            fontSize: '0.98rem',
            color: 'var(--text-primary, #1e293b)',
            lineHeight: 1.25,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5rem'
          }}
        >
          {dish.name}
        </div>

        {/* Rating Stars & Prep Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontWeight: 700 }}>
            <Star size={12} fill="#f59e0b" /> {dish.rating || 4.8}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{dish.prepTime || 12}m</span>
        </div>

        {/* Signature Orange Price Tag (Foodie App UI Kit) */}
        <div
          style={{
            fontSize: '1.08rem',
            fontWeight: 900,
            color: '#FA4A0C',
            letterSpacing: '-0.02em',
            marginTop: '0.2rem'
          }}
        >
          {formatCurrency(dish.price)}
        </div>

        {/* Add to Cart / Quantity Controller */}
        <div style={{ width: '100%', marginTop: '0.5rem' }}>
          {qty === 0 ? (
            <button
              type="button"
              onClick={() => addToCart(dish, 1)}
              style={{
                width: '100%',
                backgroundColor: '#FA4A0C',
                backgroundImage: 'linear-gradient(135deg, #FA4A0C 0%, #FF6B00 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '100px',
                padding: '0.5rem 0',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                boxShadow: '0 6px 16px rgba(250, 74, 12, 0.35)',
                transition: 'transform 0.15s'
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Plus size={14} /> ADD
            </button>
          ) : (
            <div
              style={{
                width: '100%',
                backgroundColor: '#FA4A0C',
                color: '#ffffff',
                borderRadius: '100px',
                padding: '0.35rem 0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 800,
                fontSize: '0.88rem',
                boxShadow: '0 6px 16px rgba(250, 74, 12, 0.35)'
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
                <Minus size={14} />
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
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileFloatingCard;
