import React from 'react';
import { Clock, ChefHat, CheckCircle2, Archive, XCircle } from 'lucide-react';

/**
 * CampusBite Universal Order Status Badge
 * Standardized status: pending | preparing | ready | completed | cancelled
 */
export const StatusBadge = ({
  status = 'pending',
  size = 'md',
  showIcon = true,
  className = '',
  style = {},
  ...props
}) => {
  const normalizedStatus = (status || 'pending').toLowerCase();

  const getStatusConfig = () => {
    switch (normalizedStatus) {
      case 'pending':
      case 'placed':
        return {
          label: 'Order Placed',
          className: 'pending',
          icon: <Clock size={size === 'sm' ? 12 : 14} />
        };
      case 'preparing':
      case 'cooking':
        return {
          label: 'Preparing in Kitchen',
          className: 'preparing',
          icon: <ChefHat size={size === 'sm' ? 12 : 14} />
        };
      case 'ready':
      case 'ready for pickup':
        return {
          label: 'Ready for Pickup',
          className: 'ready',
          icon: <CheckCircle2 size={size === 'sm' ? 12 : 14} />
        };
      case 'completed':
      case 'delivered':
      case 'picked up':
        return {
          label: 'Completed',
          className: 'completed',
          icon: <Archive size={size === 'sm' ? 12 : 14} />
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'cancelled',
          icon: <XCircle size={size === 'sm' ? 12 : 14} />
        };
      default:
        return {
          label: status,
          className: 'pending',
          icon: <Clock size={size === 'sm' ? 12 : 14} />
        };
    }
  };

  const config = getStatusConfig();

  const sizeStyle = size === 'sm'
    ? { fontSize: '0.70rem', padding: '0.2rem 0.55rem' }
    : size === 'lg'
    ? { fontSize: '0.85rem', padding: '0.4rem 0.95rem' }
    : {};

  return (
    <span
      className={`badge-status ${config.className} ${className}`}
      style={{ ...sizeStyle, ...style }}
      {...props}
    >
      {showIcon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
};
