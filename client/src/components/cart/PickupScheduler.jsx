import React from 'react';
import { useCart, PICKUP_OPTIONS } from '../../context/CartContext';
import { Clock, Zap } from 'lucide-react';

export const PickupScheduler = () => {
  const { pickupType, setPickupType, getFormattedPickupTime } = useCart();

  return (
    <div
      style={{
        backgroundColor: 'var(--surface-subtle)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        marginBottom: '1.5rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} color="var(--brand-primary)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Schedule Pickup Window
          </h4>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--veg-color)', backgroundColor: 'var(--veg-bg)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
          Express Counter #3
        </span>
      </div>

      {/* Options Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '0.6rem',
          marginBottom: '0.85rem'
        }}
      >
        {PICKUP_OPTIONS.map((option) => {
          const isSelected = pickupType === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setPickupType(option.id)}
              style={{
                padding: '0.65rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                border: isSelected ? '2px solid var(--brand-primary)' : '1px solid var(--border)',
                backgroundColor: isSelected ? '#ffffff' : 'var(--surface)',
                color: isSelected ? 'var(--brand-primary)' : 'var(--text-secondary)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '0.82rem',
                textAlign: 'center',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              {option.id === 'immediate' && <Zap size={14} color="var(--brand-primary)" />}
              <span>{option.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Target Estimated Handover Time */}
      <div
        style={{
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          backgroundColor: '#ffffff',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Estimated Pickup:</span>
        <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>
          {getFormattedPickupTime()}
        </span>
      </div>
    </div>
  );
};
