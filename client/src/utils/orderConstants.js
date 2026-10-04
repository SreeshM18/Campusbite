import { Clock, ChefHat, CheckCircle2, PackageCheck, AlertCircle } from 'lucide-react';

export const ORDER_STATUSES = {
  PENDING: {
    id: 'PENDING',
    label: 'Order Received',
    badgeText: 'Received',
    desc: 'Order received. We’ll start preparing it shortly.',
    icon: Clock,
    color: '#d97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    stepIndex: 0,
    isActive: true
  },
  PREPARING: {
    id: 'PREPARING',
    label: 'Cooking & Packing',
    badgeText: 'Cooking',
    desc: 'Your order is being prepared in the canteen kitchen.',
    icon: ChefHat,
    color: '#2563eb',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    stepIndex: 1,
    isActive: true
  },
  READY: {
    id: 'READY',
    label: 'Ready for Pickup',
    badgeText: 'Ready at Counter #3',
    desc: 'Ready for Pickup! Show this token at the canteen counter.',
    icon: CheckCircle2,
    color: '#16a34a',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    stepIndex: 2,
    isActive: true
  },
  COMPLETED: {
    id: 'COMPLETED',
    label: 'Order Collected',
    badgeText: 'Collected',
    desc: 'Order collected at the canteen counter.',
    icon: PackageCheck,
    color: '#475569',
    bgColor: '#f8fafc',
    borderColor: '#e2e8f0',
    stepIndex: 3,
    isActive: false
  },
  CANCELLED: {
    id: 'CANCELLED',
    label: 'Order Cancelled',
    badgeText: 'Cancelled',
    desc: 'This order was cancelled.',
    icon: AlertCircle,
    color: '#dc2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    stepIndex: -1,
    isActive: false
  }
};

export const ORDER_STEPS = [
  { id: 'PENDING', label: 'Order Received', desc: 'Sent to kitchen', timeKey: 'createdAt', icon: Clock },
  { id: 'PREPARING', label: 'Cooking & Packing', desc: 'Freshly prepared', timeKey: 'preparingAt', icon: ChefHat },
  { id: 'READY', label: 'Ready for Pickup', desc: 'At Counter #3 desk', timeKey: 'readyAt', icon: CheckCircle2 },
  { id: 'COMPLETED', label: 'Order Collected', desc: 'Food collected', timeKey: 'completedAt', icon: PackageCheck }
];

export const getStatusMeta = (status) => {
  const normalized = (status || 'PENDING').toUpperCase();
  return ORDER_STATUSES[normalized] || ORDER_STATUSES.PENDING;
};
