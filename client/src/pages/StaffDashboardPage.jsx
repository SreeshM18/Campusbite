import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StaffShell } from '../components/layout/StaffShell';
import { KitchenOrderTicket } from '../components/staff/KitchenOrderTicket';
import { CompletedOrdersTable } from '../components/staff/CompletedOrdersTable';
import { StaffCancelModal } from '../components/staff/StaffCancelModal';
import { orderApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  Clock,
  ChefHat,
  CheckCircle2,
  PackageCheck,
  RefreshCw,
  AlertCircle,
  Search,
  IndianRupee,
  Activity,
  Layers,
  Sparkles,
  WifiOff
} from 'lucide-react';

export const StaffDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pending: 0,
    preparing: 0,
    ready: 0,
    completed: 0,
    revenue: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ACTIVE'); // ACTIVE, PENDING, PREPARING, READY, COMPLETED
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);

  // Fetch kitchen orders & live stats
  const fetchKitchenData = useCallback(async (isBackground = false) => {
    try {
      if (isBackground) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [ordersRes, statsRes] = await Promise.all([
        orderApi.getStaffOrders(),
        orderApi.getStaffStats()
      ]);

      if (ordersRes && ordersRes.success) {
        setOrders(ordersRes.data || ordersRes.orders || []);
      }
      if (statsRes && statsRes.success) {
        setStats(statsRes.stats || statsRes.data || { totalOrders: 0, pending: 0, preparing: 0, ready: 0, completed: 0, revenue: 0 });
      }
      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Kitchen queue sync error:', err);
      setError(err.message || 'Unable to sync with canteen database.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Polling every 10 seconds for real-time-ish kitchen order updates
  useEffect(() => {
    fetchKitchenData(false);

    const intervalId = setInterval(() => {
      fetchKitchenData(true);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [fetchKitchenData]);

  // Handle status update transitions: PENDING -> PREPARING -> READY -> COMPLETED
  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      setActionLoadingId(orderId);
      const res = await orderApi.updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        await fetchKitchenData(true);
      }
    } catch (err) {
      alert(`Status transition failed: ${err.message || 'Server error'}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle order cancellation from kitchen modal
  const handleConfirmCancel = async (orderId, reason) => {
    try {
      const res = await orderApi.cancelOrder(orderId, reason);
      if (res.success) {
        await fetchKitchenData(true);
      }
    } catch (err) {
      alert(`Cancellation failed: ${err.message || 'Server error'}`);
    }
  };

  // Filter orders by token / customer name search
  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return orders;
    const q = searchQuery.toLowerCase().trim();
    return orders.filter((order) => {
      const matchToken = order.token?.toLowerCase().includes(q);
      const matchCustomer = order.user?.name?.toLowerCase().includes(q);
      const matchInstructions = order.specialInstructions?.toLowerCase().includes(q);
      return matchToken || matchCustomer || matchInstructions;
    });
  }, [orders, searchQuery]);

  // Split orders into operational kitchen columns
  const pendingOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'PENDING'),
    [filteredOrders]
  );
  const preparingOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'PREPARING'),
    [filteredOrders]
  );
  const readyOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'READY'),
    [filteredOrders]
  );
  const completedOrders = useMemo(
    () => filteredOrders.filter((o) => o.status === 'COMPLETED' || o.status === 'CANCELLED'),
    [filteredOrders]
  );

  const activeOrdersCount = pendingOrders.length + preparingOrders.length + readyOrders.length;

  return (
    <StaffShell
      activeCount={activeOrdersCount}
      onRefresh={() => fetchKitchenData(true)}
      refreshing={refreshing}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* 1. Operational Overview KPI Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.85rem'
          }}
        >
          {/* Active Queue Counter */}
          <div
            className="card"
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'block',
                marginBottom: '0.25rem'
              }}
            >
              Active Queue
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
              {activeOrdersCount}
            </div>
          </div>

          {/* Pending / New */}
          <div
            className="card"
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #f59e0b',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#d97706',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                marginBottom: '0.25rem'
              }}
            >
              <Clock size={13} /> Pending Orders
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
              {stats.pending || pendingOrders.length}
            </div>
          </div>

          {/* Preparing / Cooking */}
          <div
            className="card"
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #2563eb',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                marginBottom: '0.25rem'
              }}
            >
              <ChefHat size={13} /> In Cooking
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
              {stats.preparing || preparingOrders.length}
            </div>
          </div>

          {/* Ready at Counter */}
          <div
            className="card"
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #16a34a',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#16a34a',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                marginBottom: '0.25rem'
              }}
            >
              <CheckCircle2 size={13} /> Ready for Pickup
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
              {stats.ready || readyOrders.length}
            </div>
          </div>

          {/* Fulfilled Today */}
          <div
            className="card"
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #475569',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                marginBottom: '0.25rem'
              }}
            >
              <PackageCheck size={13} /> Fulfilled
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
              {stats.completed || completedOrders.length}
            </div>
          </div>

          {/* Today's Settled Revenue */}
          <div
            className="card"
            style={{
              padding: '1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#059669',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
                marginBottom: '0.25rem'
              }}
            >
              <IndianRupee size={13} /> Settled Revenue
            </span>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#059669', lineHeight: 1 }}>
              {formatCurrency(stats.revenue || 0)}
            </div>
          </div>
        </div>

        {/* 2. Operational Control & Filter Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
            backgroundColor: '#ffffff',
            padding: '0.85rem 1.15rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}
        >
          {/* Quick Token Search Input */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 280px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}
            />
            <input
              type="text"
              placeholder="Quick search by token (e.g. 1042) or student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{
                paddingLeft: '2.4rem',
                paddingRight: '0.85rem',
                height: '40px',
                fontSize: '0.88rem',
                width: '100%',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-md)'
              }}
              aria-label="Search orders by token or customer name"
            />
          </div>

          {/* Operational View Filter Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}
          >
            {[
              { id: 'ACTIVE', label: 'All Active', count: activeOrdersCount },
              { id: 'PENDING', label: 'Pending', count: pendingOrders.length },
              { id: 'PREPARING', label: 'In Cooking', count: preparingOrders.length },
              { id: 'READY', label: 'Ready at Counter', count: readyOrders.length },
              { id: 'COMPLETED', label: 'Fulfilled Logs', count: completedOrders.length }
            ].map((tab) => {
              const isSelected = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.84rem',
                    fontWeight: isSelected ? 700 : 600,
                    backgroundColor: isSelected ? '#0f172a' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#475569',
                    border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.05rem 0.4rem',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: isSelected ? '#334155' : '#e2e8f0',
                      color: isSelected ? '#f8fafc' : '#475569'
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Manual Sync Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => fetchKitchenData(true)}
              disabled={refreshing}
              className="btn btn-secondary btn-sm"
              style={{
                height: '40px',
                padding: '0 0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1'
              }}
              title="Sync kitchen queue immediately"
              aria-label="Sync kitchen queue"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              <span style={{ fontSize: '0.84rem' }}>{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              fontSize: '0.88rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <WifiOff size={18} />
              <span><strong>Connection Notice:</strong> {error} Showing last loaded kitchen queue.</span>
            </div>
            <button
              type="button"
              onClick={() => fetchKitchenData(false)}
              className="btn btn-sm"
              style={{ backgroundColor: '#991b1b', color: '#ffffff', padding: '0.25rem 0.65rem' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* 3. Main Operational Queue Rendering */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1.25rem',
              padding: '2rem 0'
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div
                key={sk}
                className="card"
                style={{
                  height: '240px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid #e2e8f0',
                  animation: 'pulse 1.5s infinite'
                }}
              />
            ))}
          </div>
        ) : activeFilter === 'COMPLETED' ? (
          /* Fulfilled Order Logs View */
          <CompletedOrdersTable orders={completedOrders} />
        ) : activeFilter === 'ACTIVE' ? (
          /* Kanban 3-Column Display for Fast Scanning (Desktop/Tablet) */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem',
              alignItems: 'start'
            }}
            className="kitchen-kanban-grid"
          >
            {/* COLUMN 1: PENDING */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid #e2e8f0',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: '400px'
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.65rem',
                  borderBottom: '2px solid #f59e0b'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Clock size={16} color="#d97706" />
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>1. New Orders</strong>
                </div>
                <span
                  style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {pendingOrders.length}
                </span>
              </div>

              {/* Ticket Cards */}
              {pendingOrders.length === 0 ? (
                <div
                  style={{
                    padding: '3rem 1rem',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '0.88rem'
                  }}
                >
                  No pending orders.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pendingOrders.map((order) => (
                    <KitchenOrderTicket
                      key={order._id}
                      order={order}
                      onUpdateStatus={handleUpdateStatus}
                      onCancelClick={(ord) => setCancelModalOrder(ord)}
                      actionLoading={actionLoadingId === order._id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* COLUMN 2: PREPARING */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid #e2e8f0',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: '400px'
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.65rem',
                  borderBottom: '2px solid #2563eb'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <ChefHat size={16} color="#2563eb" />
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>2. In Cooking</strong>
                </div>
                <span
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {preparingOrders.length}
                </span>
              </div>

              {/* Ticket Cards */}
              {preparingOrders.length === 0 ? (
                <div
                  style={{
                    padding: '3rem 1rem',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '0.88rem'
                  }}
                >
                  No orders currently cooking.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {preparingOrders.map((order) => (
                    <KitchenOrderTicket
                      key={order._id}
                      order={order}
                      onUpdateStatus={handleUpdateStatus}
                      onCancelClick={(ord) => setCancelModalOrder(ord)}
                      actionLoading={actionLoadingId === order._id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* COLUMN 3: READY */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid #e2e8f0',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minHeight: '400px'
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.65rem',
                  borderBottom: '2px solid #16a34a'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle2 size={16} color="#16a34a" />
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>3. Ready for Handover</strong>
                </div>
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.55rem',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  {readyOrders.length}
                </span>
              </div>

              {/* Ticket Cards */}
              {readyOrders.length === 0 ? (
                <div
                  style={{
                    padding: '3rem 1rem',
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '0.88rem'
                  }}
                >
                  No orders waiting for pickup.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {readyOrders.map((order) => (
                    <KitchenOrderTicket
                      key={order._id}
                      order={order}
                      onUpdateStatus={handleUpdateStatus}
                      onCancelClick={(ord) => setCancelModalOrder(ord)}
                      actionLoading={actionLoadingId === order._id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Specific Filter Grid View */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {(activeFilter === 'PENDING'
              ? pendingOrders
              : activeFilter === 'PREPARING'
              ? preparingOrders
              : readyOrders
            ).map((order) => (
              <KitchenOrderTicket
                key={order._id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
                onCancelClick={(ord) => setCancelModalOrder(ord)}
                actionLoading={actionLoadingId === order._id}
              />
            ))}
          </div>
        )}

      </div>

      {/* Staff Rejection Modal */}
      {cancelModalOrder && (
        <StaffCancelModal
          order={cancelModalOrder}
          isOpen={!!cancelModalOrder}
          onClose={() => setCancelModalOrder(null)}
          onConfirmCancel={handleConfirmCancel}
        />
      )}

      <style>{`
        @media (max-width: 767px) {
          .kitchen-kanban-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
        @media (min-width: 768px) and (max-width: 1099px) {
          .kitchen-kanban-grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
            gap: 1rem !important;
          }
        }
        @media (min-width: 1100px) {
          .kitchen-kanban-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1.25rem !important;
          }
        }
      `}</style>
    </StaffShell>
  );
};
