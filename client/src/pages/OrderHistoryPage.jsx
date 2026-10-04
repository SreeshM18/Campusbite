import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderApi, menuApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { PageContainer } from '../components/ui/PageContainer';
import { ActiveOrderCard } from '../components/orders/ActiveOrderCard';
import { PastOrderRow } from '../components/orders/PastOrderRow';
import { CancelOrderModal } from '../components/orders/CancelOrderModal';
import { OrderSkeletons } from '../components/orders/OrderSkeletons';
import {
  Utensils,
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters and Search
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  const [searchQuery, setSearchQuery] = useState('');

  // Cancellation Modal state
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const fetchOrders = async (isManual = false, targetPage = currentPage) => {
    try {
      if (isManual) setRefreshing(true);
      else if (orders.length === 0) setLoading(true);
      setError(null);

      const params = {
        page: targetPage,
        limit: 20
      };
      if (filterTab !== 'ALL') params.status = filterTab;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await orderApi.getMyOrders(params);
      if (res.success && res.data) {
        setOrders(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || res.data.length);
      } else {
        throw new Error(res.message || 'Failed to load orders.');
      }
    } catch (err) {
      console.error('[Order History Error]:', err);
      setError(err.message || 'Could not load your orders.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchOrders(false, 1);
  }, [filterTab, searchQuery]);

  // Periodic lightweight polling: Every 15 seconds IF any order is active
  useEffect(() => {
    const hasActiveOrders = orders.some((o) =>
      ['PENDING', 'PREPARING', 'READY'].includes(o.status)
    );

    if (!hasActiveOrders) return;

    const intervalId = setInterval(() => {
      fetchOrders(true, currentPage);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [orders, currentPage, filterTab, searchQuery]);

  // Page change handler
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchOrders(false, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Cancellation Handler
  const handleConfirmCancel = async (orderId, reason) => {
    const res = await orderApi.cancelOrder(orderId, reason);
    if (res.success) {
      showToast(`Order #${res.data?.token || 'CB'} has been cancelled.`, 'success');
      fetchOrders(true, currentPage);
    } else {
      throw new Error(res.message || 'Failed to cancel order.');
    }
  };

  // Intelligent "Order Again" Flow
  const handleReorder = async (pastOrder) => {
    try {
      // 1. Fetch current live menu to check latest availability & prices
      const menuRes = await menuApi.getMenu();
      const liveItems = menuRes.data || [];
      const liveItemMap = new Map(liveItems.map((item) => [item._id.toString(), item]));

      let addedCount = 0;
      const unavailableNames = [];

      for (const orderItem of pastOrder.items || []) {
        const menuItemId = (orderItem.menuItem?._id || orderItem.menuItem || '').toString();
        const liveItem = liveItemMap.get(menuItemId);

        if (liveItem && liveItem.available) {
          // Add to cart with current live price & details
          addItem(liveItem, orderItem.quantity || 1);
          addedCount += (orderItem.quantity || 1);
        } else {
          unavailableNames.push(orderItem.name);
        }
      }

      if (addedCount > 0) {
        if (unavailableNames.length > 0) {
          showToast(
            `Added available items to your food tray. Note: "${unavailableNames.join(', ')}" is currently sold out.`,
            'warning'
          );
        } else {
          showToast('Dishes added to your food tray!', 'success');
        }
        navigate('/cart');
      } else {
        showToast('Sorry, the items from this past order are currently not available in today\'s menu.', 'warning');
      }
    } catch (err) {
      console.error('[Reorder Error]:', err);
      showToast('Could not add dishes to tray. Please check current menu.', 'error');
    }
  };

  // Partition Active vs Past Orders
  const activeOrders = orders.filter((o) => ['PENDING', 'PREPARING', 'READY'].includes(o.status));
  const pastOrders = orders.filter((o) => ['COMPLETED', 'CANCELLED'].includes(o.status));

  return (
    <PageContainer size="standard" paddingY="lg">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1050,
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: toastMessage.type === 'success' ? '#15803d' : toastMessage.type === 'warning' ? '#d97706' : '#1e293b',
            color: '#ffffff',
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toastMessage.msg}</span>
        </div>
      )}

      {/* 1. Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-brand-primary)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.35rem' }}>
            <Sparkles size={14} /> My Orders & Live Tokens
          </div>
          <h1 className="type-h2" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
            Canteen Orders
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
            Track active pickup tokens and quickly reorder your favorite meals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchOrders(true, currentPage)}
          disabled={refreshing}
          className="btn btn-secondary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          aria-label="Refresh orders list"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span>{refreshing ? 'Updating...' : 'Refresh'}</span>
        </button>
      </div>

      {/* 2. Filter Tabs & Search Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--color-border-subtle)'
        }}
      >
        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }}>
          {[
            { id: 'ALL', label: 'All Orders' },
            { id: 'ACTIVE', label: 'Active Pickup' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' }
          ].map((tab) => {
            const isSelected = filterTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 700 : 500,
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search by Token or Dish */}
        <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '340px' }}>
          <Search size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search token (CB-...) or dish"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
            style={{ width: '100%', paddingLeft: '2.4rem', fontSize: '0.86rem' }}
            aria-label="Search orders by token or dish name"
          />
        </div>
      </div>

      {/* 3. Main Content: Loading, Error, or Lists */}
      {loading ? (
        <OrderSkeletons count={3} />
      ) : error ? (
        <div
          className="card"
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)'
          }}
        >
          <AlertCircle size={36} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
          <h3 className="type-h4" style={{ marginBottom: '0.5rem' }}>We couldn't load your orders</h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {error}
          </p>
          <button type="button" onClick={() => fetchOrders(false, 1)} className="btn btn-primary btn-sm">
            Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '4rem 1.5rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            backgroundColor: 'var(--color-surface)',
            border: '1px dashed var(--color-border)',
            maxWidth: '520px',
            margin: '0 auto'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <ShoppingBag size={28} color="var(--color-brand-primary)" />
          </div>
          <h3 className="type-h4" style={{ color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
            {searchQuery || filterTab !== 'ALL' ? 'No Matching Orders' : 'No Orders Yet'}
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {searchQuery || filterTab !== 'ALL'
              ? 'Try adjusting your search terms or filter selection.'
              : 'Your campus pre-orders and pickup tokens will appear here. Find something fresh for your break!'}
          </p>
          {searchQuery || filterTab !== 'ALL' ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterTab('ALL');
              }}
              className="btn btn-secondary btn-md"
            >
              Reset Filters
            </button>
          ) : (
            <Link to="/menu" className="btn btn-primary btn-md" style={{ textDecoration: 'none' }}>
              Explore Canteen Menu
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Active Orders Section (Always Prominent) */}
          {(filterTab === 'ALL' || filterTab === 'ACTIVE') && (
            <section aria-label="Active Pickup Orders">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Clock size={18} color="var(--color-brand-primary)" />
                <h2 className="type-h4" style={{ margin: 0, color: 'var(--color-text-primary)' }}>
                  Active Orders ({activeOrders.length})
                </h2>
              </div>

              {activeOrders.length > 0 ? (
                <div>
                  {activeOrders.map((order) => (
                    <ActiveOrderCard
                      key={order._id}
                      order={order}
                      onCancelClick={(ord) => setOrderToCancel(ord)}
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <span>No active orders right now. Ready for lunch or a quick break?</span>
                  <Link to="/menu" style={{ color: 'var(--color-brand-primary)', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                    Browse Menu →
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* Past Orders Section */}
          {(filterTab === 'ALL' || filterTab === 'COMPLETED' || filterTab === 'CANCELLED') && pastOrders.length > 0 && (
            <section aria-label="Past Orders History">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Utensils size={18} color="var(--color-text-muted)" />
                <h2 className="type-h4" style={{ margin: 0, color: 'var(--color-text-primary)' }}>
                  Past Orders ({pastOrders.length})
                </h2>
              </div>

              <div>
                {pastOrders.map((order) => (
                  <PastOrderRow
                    key={order._id}
                    order={order}
                    onReorder={handleReorder}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--color-border-subtle)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    aria-label="Previous Page"
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <span style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary btn-sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    aria-label="Next Page"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      <CancelOrderModal
        order={orderToCancel}
        isOpen={Boolean(orderToCancel)}
        onClose={() => setOrderToCancel(null)}
        onConfirmCancel={handleConfirmCancel}
      />
    </PageContainer>
  );
};
