import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StaffShell } from '../components/layout/StaffShell';
import { menuApi } from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  ChefHat,
  Plus,
  Edit2,
  Trash2,
  Archive,
  ArchiveRestore,
  Copy,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Star,
  Clock,
  Check,
  RefreshCw,
  Layers,
  UtensilsCrossed,
  Filter,
  CheckSquare,
  Square,
  Image as ImageIcon
} from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'BREAKFAST', label: 'Breakfast' },
  { id: 'MEALS', label: 'Meals & Biryani' },
  { id: 'FAST_FOOD', label: 'Fast Food' },
  { id: 'SNACKS', label: 'Snacks & Quick Bites' },
  { id: 'BEVERAGES', label: 'Beverages & Chai' },
  { id: 'DESSERTS', label: 'Desserts & Ice Cream' },
  { id: 'HEALTHY', label: 'Healthy & Bowls' }
];

const MEAL_PERIODS = ['ALL_DAY', 'BREAKFAST', 'LUNCH', 'EVENING'];

export const StaffMenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    availableCount: 0,
    soldOutCount: 0,
    unavailableCount: 0,
    featuredCount: 0,
    archivedCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDiet, setSelectedDiet] = useState('ALL'); // ALL, VEG, NON_VEG
  const [selectedStatus, setSelectedStatus] = useState('ALL'); // ALL, AVAILABLE, SOLD_OUT, UNAVAILABLE, ARCHIVED

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [generalFormError, setGeneralFormError] = useState('');

  // Delete / Archive Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: 'ARCHIVE', // ARCHIVE or DELETE
    item: null
  });

  // Form Field State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'MEALS',
    subcategory: 'General',
    foodType: 'VEG',
    image: '/images/veg_biriyani.jpg',
    preparationTime: 15,
    availabilityStatus: 'AVAILABLE',
    featured: false,
    mealPeriod: 'ALL_DAY'
  });

  // Fetch menu data from MongoDB
  const fetchMenuData = useCallback(async (isBackground = false) => {
    try {
      if (isBackground) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const params = {
        category: selectedCategory,
        foodType: selectedDiet,
        search: search.trim()
      };

      if (selectedStatus === 'ARCHIVED') {
        params.archived = 'true';
      } else if (selectedStatus !== 'ALL') {
        params.availabilityStatus = selectedStatus;
      }

      const res = await menuApi.getStaffMenu(params);

      if (res && res.success) {
        setMenuItems(res.data || res.menuItems || res.items || []);
        if (res.stats) {
          setStats(res.stats);
        }
      }
    } catch (err) {
      console.error('Failed to load menu items:', err);
      setError(err.message || 'Unable to load menu inventory.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCategory, selectedDiet, selectedStatus, search]);

  useEffect(() => {
    fetchMenuData(false);
  }, [fetchMenuData]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: selectedCategory !== 'ALL' ? selectedCategory : 'MEALS',
      subcategory: 'General',
      foodType: 'VEG',
      image: '/images/veg_biriyani.jpg',
      preparationTime: 12,
      availabilityStatus: 'AVAILABLE',
      featured: false,
      mealPeriod: 'ALL_DAY'
    });
    setFormErrors({});
    setGeneralFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      subcategory: item.subcategory || 'General',
      foodType: item.foodType || 'VEG',
      image: item.image || '/images/veg_biriyani.jpg',
      preparationTime: item.preparationTime || 10,
      availabilityStatus: item.availabilityStatus || (item.available ? 'AVAILABLE' : 'SOLD_OUT'),
      featured: !!item.featured,
      mealPeriod: item.mealPeriod || 'ALL_DAY'
    });
    setFormErrors({});
    setGeneralFormError('');
    setIsModalOpen(true);
  };

  // Open Duplicate Modal
  const handleDuplicateItem = (item) => {
    setEditingItem(null);
    setFormData({
      name: `${item.name} (Copy)`,
      description: item.description,
      price: item.price,
      category: item.category,
      subcategory: item.subcategory || 'General',
      foodType: item.foodType || 'VEG',
      image: item.image || '/images/veg_biriyani.jpg',
      preparationTime: item.preparationTime || 10,
      availabilityStatus: 'AVAILABLE',
      featured: false,
      mealPeriod: item.mealPeriod || 'ALL_DAY'
    });
    setFormErrors({});
    setGeneralFormError('');
    setIsModalOpen(true);
  };

  // Fast inline stock toggle (AVAILABLE <-> SOLD_OUT)
  const handleToggleStockStatus = async (item, targetStatus) => {
    try {
      const res = await menuApi.toggleAvailability(item._id, targetStatus);
      if (res.success) {
        setMenuItems((prev) =>
          prev.map((i) =>
            i._id === item._id
              ? {
                  ...i,
                  availabilityStatus: res.data.availabilityStatus,
                  available: res.data.available
                }
              : i
          )
        );
        fetchMenuData(true);
      }
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  // Toggle Featured status
  const handleToggleFeatured = async (item) => {
    try {
      const nextFeatured = !item.featured;
      const res = await menuApi.updateMenuItem(item._id, { featured: nextFeatured });
      if (res.success) {
        setMenuItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, featured: nextFeatured } : i))
        );
        fetchMenuData(true);
      }
    } catch (err) {
      alert(`Could not toggle featured state: ${err.message}`);
    }
  };

  // Handle Form Submission (Add / Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setGeneralFormError('');

    // Client validation
    const errors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Dish name must be at least 2 characters.';
    }
    if (!formData.description || formData.description.trim().length < 3) {
      errors.description = 'Description must be at least 3 characters.';
    }
    const numPrice = Number(formData.price);
    if (formData.price === '' || isNaN(numPrice) || numPrice <= 0) {
      errors.price = 'Price must be a valid number greater than ₹0.';
    }
    if (!formData.category) {
      errors.category = 'Please select a food category.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setFormLoading(true);

      if (editingItem) {
        const res = await menuApi.updateMenuItem(editingItem._id, formData);
        if (res.success) {
          setIsModalOpen(false);
          await fetchMenuData(true);
        }
      } else {
        const res = await menuApi.createMenuItem(formData);
        if (res.success) {
          setIsModalOpen(false);
          await fetchMenuData(true);
        }
      }
    } catch (err) {
      if (err.errors && Object.keys(err.errors).length > 0) {
        setFormErrors(err.errors);
      } else {
        setGeneralFormError(err.message || 'Operation failed. Please check form fields.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  // Handle Confirm Archive / Restore / Delete
  const handleConfirmAction = async () => {
    if (!confirmModal.item) return;
    const { item, type } = confirmModal;

    try {
      if (type === 'ARCHIVE') {
        const nextArchived = !item.isArchived;
        await menuApi.archiveMenuItem(item._id, nextArchived);
      } else if (type === 'DELETE') {
        await menuApi.deleteMenuItem(item._id);
      }
      setConfirmModal({ isOpen: false, type: 'ARCHIVE', item: null });
      await fetchMenuData(true);
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    }
  };

  // Bulk Availability Action
  const handleBulkStatusChange = async (targetStatus) => {
    if (selectedIds.length === 0) return;
    try {
      setBulkLoading(true);
      const res = await menuApi.bulkUpdateAvailability(selectedIds, targetStatus);
      if (res.success) {
        setSelectedIds([]);
        await fetchMenuData(true);
      }
    } catch (err) {
      alert(`Bulk update failed: ${err.message}`);
    } finally {
      setBulkLoading(false);
    }
  };

  // Checkbox selection helpers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === menuItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(menuItems.map((i) => i._id));
    }
  };

  const handleToggleSelectItem = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <StaffShell activeCount={0}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* 1. Header & Quick Actions */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: '#ffffff',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #cbd5e1',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--color-brand-primary)', fontWeight: 800, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <UtensilsCrossed size={14} />
              <span>Catalog & Inventory Authority</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '0.15rem 0 0.2rem' }}>
              Menu & Live Stock Management
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
              Directly control canteen dishes, prices, preparation timing, and real-time stock availability.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Customer Menu Preview Link */}
            <a
              href="/menu"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.86rem',
                minHeight: '42px'
              }}
              title="Preview how students see the menu"
            >
              <ExternalLink size={15} />
              <span>Preview Customer Menu</span>
            </a>

            {/* Add Food Button */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="btn btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                minHeight: '42px',
                padding: '0 1.25rem'
              }}
            >
              <Plus size={18} />
              <span>Add Menu Item</span>
            </button>
          </div>
        </div>

        {/* 2. Operational Inventory Metrics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.85rem'
          }}
        >
          {/* Total Dishes */}
          <div
            className="card"
            style={{
              padding: '0.9rem 1.15rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #cbd5e1'
            }}
          >
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              Active Catalog
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>
              {stats.totalItems || menuItems.length}
            </div>
          </div>

          {/* Available In Stock */}
          <div
            className="card"
            style={{
              padding: '0.9rem 1.15rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #16a34a'
            }}
          >
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              In Stock (Orderable)
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#16a34a' }}>
              {stats.availableCount}
            </div>
          </div>

          {/* Sold Out */}
          <div
            className="card"
            style={{
              padding: '0.9rem 1.15rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #f59e0b'
            }}
          >
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              Sold Out (Temporarily)
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#d97706' }}>
              {stats.soldOutCount}
            </div>
          </div>

          {/* Hidden / Unavailable */}
          <div
            className="card"
            style={{
              padding: '0.9rem 1.15rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #64748b'
            }}
          >
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              Disabled / Hidden
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#475569' }}>
              {stats.unavailableCount}
            </div>
          </div>

          {/* Featured Dishes */}
          <div
            className="card"
            style={{
              padding: '0.9rem 1.15rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #cbd5e1',
              borderLeft: '4px solid #e11d48'
            }}
          >
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#e11d48', textTransform: 'uppercase', display: 'block', marginBottom: '0.2rem' }}>
              Featured Specials
            </span>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#e11d48' }}>
              {stats.featuredCount}
            </div>
          </div>
        </div>

        {/* 3. Search & Filter Toolbar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid #cbd5e1',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '260px', flex: '1 1 300px' }}>
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
                placeholder="Search food by name, subcategory or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input"
                style={{
                  paddingLeft: '2.4rem',
                  height: '40px',
                  fontSize: '0.88rem',
                  width: '100%',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-md)'
                }}
              />
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select"
              style={{
                height: '40px',
                fontSize: '0.85rem',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: 'var(--radius-md)',
                minWidth: '180px'
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Diet Filter Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
              {['ALL', 'VEG', 'NON_VEG'].map((diet) => {
                const isSelected = selectedDiet === diet;
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setSelectedDiet(diet)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 800 : 600,
                      backgroundColor: isSelected ? '#ffffff' : 'transparent',
                      color: isSelected ? '#0f172a' : '#64748b',
                      border: 'none',
                      boxShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {diet === 'ALL' ? 'All Diets' : diet === 'VEG' ? 'Pure Veg' : 'Non-Veg'}
                  </button>
                );
              })}
            </div>

            {/* Refresh Sync Button */}
            <button
              type="button"
              onClick={() => fetchMenuData(true)}
              disabled={refreshing}
              className="btn btn-ghost btn-sm"
              style={{ height: '40px', padding: '0 0.75rem', color: '#475569' }}
              title="Refresh menu inventory"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* Availability Filter Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              overflowX: 'auto',
              paddingTop: '0.25rem',
              borderTop: '1px solid #f1f5f9'
            }}
          >
            {[
              { id: 'ALL', label: 'All Dishes', count: stats.totalItems },
              { id: 'AVAILABLE', label: 'In Stock', count: stats.availableCount },
              { id: 'SOLD_OUT', label: 'Sold Out', count: stats.soldOutCount },
              { id: 'UNAVAILABLE', label: 'Disabled / Hidden', count: stats.unavailableCount },
              { id: 'ARCHIVED', label: 'Archived Items', count: stats.archivedCount }
            ].map((tab) => {
              const isSelected = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatus(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 600,
                    backgroundColor: isSelected ? '#0f172a' : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#64748b',
                    border: isSelected ? '1px solid #0f172a' : '1px solid #e2e8f0',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.05rem 0.35rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: isSelected ? '#334155' : '#e2e8f0',
                        color: isSelected ? '#f8fafc' : '#64748b'
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Bulk Action Floating Bar (when rows are selected) */}
        {selectedIds.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              animation: 'fadeIn 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckSquare size={18} color="var(--color-brand-primary)" />
              <strong style={{ fontSize: '0.92rem' }}>
                {selectedIds.length} dishes selected
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('AVAILABLE')}
                disabled={bulkLoading}
                className="btn btn-sm"
                style={{ backgroundColor: '#16a34a', color: '#ffffff', fontSize: '0.82rem' }}
              >
                Mark In Stock
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('SOLD_OUT')}
                disabled={bulkLoading}
                className="btn btn-sm"
                style={{ backgroundColor: '#f59e0b', color: '#0f172a', fontSize: '0.82rem' }}
              >
                Mark Sold Out
              </button>
              <button
                type="button"
                onClick={() => handleBulkStatusChange('UNAVAILABLE')}
                disabled={bulkLoading}
                className="btn btn-sm"
                style={{ backgroundColor: '#475569', color: '#ffffff', fontSize: '0.82rem' }}
              >
                Hide / Disable
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="btn btn-ghost btn-sm"
                style={{ color: '#94a3b8', fontSize: '0.82rem' }}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
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
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => fetchMenuData(false)}
              className="btn btn-sm"
              style={{ backgroundColor: '#991b1b', color: '#ffffff' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* 5. Main High-Density Inventory Table */}
        {loading ? (
          <div
            className="card"
            style={{
              padding: '3rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              color: '#64748b'
            }}
          >
            <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.75rem' }} />
            <div>Loading live menu inventory from database...</div>
          </div>
        ) : menuItems.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '3.5rem 1.5rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid #cbd5e1',
              textAlign: 'center'
            }}
          >
            <ChefHat size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
              No dishes found matching filters
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Try clearing your search query or selecting a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('ALL');
                setSelectedDiet('ALL');
                setSelectedStatus('ALL');
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              overflow: 'hidden'
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.85rem 1rem', width: '40px' }}>
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}
                        aria-label="Select all dishes"
                      >
                        {selectedIds.length === menuItems.length ? (
                          <CheckSquare size={17} color="var(--color-brand-primary)" />
                        ) : (
                          <Square size={17} />
                        )}
                      </button>
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Dish / Information
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Category & Diet
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Price (₹)
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Prep Time
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Stock Availability
                    </th>
                    <th style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', textAlign: 'right' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => {
                    const isSelected = selectedIds.includes(item._id);
                    const status = item.availabilityStatus || (item.available ? 'AVAILABLE' : 'SOLD_OUT');
                    const isAvailable = status === 'AVAILABLE';
                    const isSoldOut = status === 'SOLD_OUT';
                    const isUnavailable = status === 'UNAVAILABLE';

                    return (
                      <tr
                        key={item._id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor: isSelected ? '#fff7ed' : 'transparent',
                          opacity: item.isArchived ? 0.6 : isUnavailable ? 0.75 : 1,
                          transition: 'background-color 0.1s ease'
                        }}
                      >
                        {/* Checkbox */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <button
                            type="button"
                            onClick={() => handleToggleSelectItem(item._id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}
                            aria-label={`Select ${item.name}`}
                          >
                            {isSelected ? (
                              <CheckSquare size={17} color="var(--color-brand-primary)" />
                            ) : (
                              <Square size={17} />
                            )}
                          </button>
                        </td>

                        {/* Dish Details */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <img
                              src={item.image || '/images/veg_biriyani.jpg'}
                              alt={item.name}
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-md)',
                                objectFit: 'cover',
                                border: '1px solid #e2e8f0',
                                flexShrink: 0
                              }}
                              onError={(e) => {
                                e.target.src = '/images/veg_biriyani.jpg';
                              }}
                            />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <strong style={{ fontSize: '0.94rem', color: '#0f172a' }}>
                                  {item.name}
                                </strong>
                                {item.featured && (
                                  <span
                                    title="Featured Special"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      color: '#e11d48'
                                    }}
                                  >
                                    <Star size={13} fill="#e11d48" />
                                  </span>
                                )}
                                {item.isArchived && (
                                  <span
                                    style={{
                                      fontSize: '0.68rem',
                                      fontWeight: 800,
                                      padding: '0.05rem 0.35rem',
                                      backgroundColor: '#fee2e2',
                                      color: '#991b1b',
                                      borderRadius: '4px'
                                    }}
                                  >
                                    ARCHIVED
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', lineHeight: 1.3, maxWidth: '300px' }}>
                                {item.description?.slice(0, 60)}...
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category & Diet */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-start' }}>
                            <span
                              style={{
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#334155',
                                backgroundColor: '#f1f5f9',
                                padding: '0.1rem 0.45rem',
                                borderRadius: 'var(--radius-sm)'
                              }}
                            >
                              {item.category}
                            </span>
                            <span
                              className={`badge-dietary ${item.foodType === 'NON_VEG' ? 'non-veg' : 'veg'}`}
                              style={{ fontSize: '0.7rem', padding: '0.05rem 0.4rem' }}
                            >
                              {item.foodType}
                            </span>
                          </div>
                        </td>

                        {/* Price */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <strong
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '1rem',
                              fontWeight: 900,
                              color: 'var(--color-brand-primary)'
                            }}
                          >
                            {formatCurrency(item.price)}
                          </strong>
                        </td>

                        {/* Prep Time */}
                        <td style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', color: '#475569' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={13} color="#94a3b8" />
                            <span>{item.preparationTime || 10} min</span>
                          </div>
                        </td>

                        {/* Stock Availability Dropdown / Segmented Action */}
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <select
                            value={status}
                            onChange={(e) => handleToggleStockStatus(item, e.target.value)}
                            style={{
                              padding: '0.35rem 0.65rem',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              border: isAvailable
                                ? '1px solid #86efac'
                                : isSoldOut
                                ? '1px solid #fde047'
                                : '1px solid #cbd5e1',
                              backgroundColor: isAvailable
                                ? '#f0fdf4'
                                : isSoldOut
                                ? '#fefce8'
                                : '#f1f5f9',
                              color: isAvailable
                                ? '#15803d'
                                : isSoldOut
                                ? '#a16207'
                                : '#475569'
                            }}
                            aria-label={`Change stock status for ${item.name}`}
                          >
                            <option value="AVAILABLE">✓ In Stock</option>
                            <option value="SOLD_OUT">⚠ Sold Out</option>
                            <option value="UNAVAILABLE">✕ Disabled</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
                            {/* Toggle Featured Star */}
                            <button
                              type="button"
                              onClick={() => handleToggleFeatured(item)}
                              className="btn btn-ghost btn-sm"
                              style={{
                                color: item.featured ? '#e11d48' : '#94a3b8',
                                padding: '0.35rem'
                              }}
                              title={item.featured ? 'Remove from Featured' : 'Mark as Featured'}
                            >
                              <Star size={15} fill={item.featured ? '#e11d48' : 'none'} />
                            </button>

                            {/* Duplicate Button */}
                            <button
                              type="button"
                              onClick={() => handleDuplicateItem(item)}
                              className="btn btn-ghost btn-sm"
                              style={{ color: '#475569', padding: '0.35rem' }}
                              title="Duplicate Dish"
                            >
                              <Copy size={15} />
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              className="btn btn-ghost btn-sm"
                              style={{ color: '#2563eb', padding: '0.35rem' }}
                              title="Edit Dish Details"
                            >
                              <Edit2 size={15} />
                            </button>

                            {/* Archive / Restore Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmModal({
                                  isOpen: true,
                                  type: 'ARCHIVE',
                                  item
                                })
                              }
                              className="btn btn-ghost btn-sm"
                              style={{ color: item.isArchived ? '#16a34a' : '#64748b', padding: '0.35rem' }}
                              title={item.isArchived ? 'Restore to Menu' : 'Archive from Menu'}
                            >
                              {item.isArchived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setConfirmModal({
                                  isOpen: true,
                                  type: 'DELETE',
                                  item
                                })
                              }
                              className="btn btn-ghost btn-sm"
                              style={{ color: '#ef4444', padding: '0.35rem' }}
                              title="Permanently Delete Dish"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* 6. Add / Edit Dish Modal */}
      {isModalOpen && (
        <div
          className="drawer-backdrop"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            className="card modal-responsive"
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90dvh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              padding: '1.75rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
              animation: 'fadeIn 0.15s ease-out'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1rem',
                borderBottom: '1px solid #e2e8f0',
                marginBottom: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChefHat size={20} color="var(--color-brand-primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {editingItem ? `Edit Dish: ${editingItem.name}` : 'Add New Canteen Dish'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-ghost btn-sm"
                style={{ padding: '0.3rem', minHeight: '36px' }}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* General Form Error Banner */}
            {generalFormError && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: '#fef2f2',
                  color: '#991b1b',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.25rem',
                  fontSize: '0.85rem'
                }}
              >
                {generalFormError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              
              {/* Dish Name */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Dish Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Paneer Butter Masala"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`input ${formErrors.name ? 'input-error' : ''}`}
                  required
                />
                {formErrors.name && (
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.2rem', display: 'block' }}>
                    {formErrors.name}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Description & Ingredients *
                </label>
                <textarea
                  placeholder="Describe key ingredients, taste profile, and preparation style..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`textarea ${formErrors.description ? 'input-error' : ''}`}
                  rows={2}
                  required
                />
                {formErrors.description && (
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.2rem', display: 'block' }}>
                    {formErrors.description}
                  </span>
                )}
              </div>

              {/* Price & Prep Time Row */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="120"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`input ${formErrors.price ? 'input-error' : ''}`}
                    required
                  />
                  {formErrors.price && (
                    <span style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '0.2rem', display: 'block' }}>
                      {formErrors.price}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Preparation Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="12"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              {/* Category & Subcategory Row */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Primary Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="select"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'ALL').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Subcategory (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. South Indian, Biryani, Chai"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              {/* Food Type & Availability Row */}
              <div className="form-grid-2col">
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Dietary Classification *
                  </label>
                  <select
                    value={formData.foodType}
                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                    className="select"
                  >
                    <option value="VEG">Pure Vegetarian (VEG)</option>
                    <option value="NON_VEG">Non-Vegetarian (NON_VEG)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Stock Availability
                  </label>
                  <select
                    value={formData.availabilityStatus}
                    onChange={(e) => setFormData({ ...formData, availabilityStatus: e.target.value })}
                    className="select"
                  >
                    <option value="AVAILABLE">Available (In Stock)</option>
                    <option value="SOLD_OUT">Sold Out (Temporary)</option>
                    <option value="UNAVAILABLE">Disabled (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Image Path & Instant Preview */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                  Food Image Asset / Path *
                </label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="/images/veg_biriyani.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="input"
                    style={{ flex: 1 }}
                    required
                  />
                  <img
                    src={formData.image || '/images/veg_biriyani.jpg'}
                    alt="Preview"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      border: '1px solid #cbd5e1',
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      e.target.src = '/images/veg_biriyani.jpg';
                    }}
                  />
                </div>
              </div>

              {/* Checkboxes: Featured Special */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0.25rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Mark as <strong>Featured Chef Special</strong> on customer home</span>
                </label>
              </div>

              {/* Form Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e2e8f0',
                  marginTop: '0.5rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={formLoading}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="btn btn-primary"
                  style={{ minWidth: '120px' }}
                >
                  {formLoading ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Dish'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 7. Archive / Delete Confirmation Modal */}
      {confirmModal.isOpen && confirmModal.item && (
        <div
          className="drawer-backdrop"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '460px',
              padding: '1.75rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
              animation: 'fadeIn 0.15s ease-out'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: confirmModal.type === 'DELETE' ? '#fee2e2' : '#fef3c7',
                  color: confirmModal.type === 'DELETE' ? '#dc2626' : '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {confirmModal.type === 'DELETE' ? <Trash2 size={20} /> : <Archive size={20} />}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {confirmModal.type === 'DELETE' ? 'Delete Dish Permanently?' : 'Archive Menu Item?'}
              </h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.45, marginBottom: '1.5rem' }}>
              {confirmModal.type === 'DELETE'
                ? `Are you sure you want to permanently delete "${confirmModal.item.name}" from MongoDB? Historical order receipts will preserve their name and price snapshots.`
                : confirmModal.item.isArchived
                ? `Restore "${confirmModal.item.name}" back into the active canteen catalog?`
                : `Archiving "${confirmModal.item.name}" will safely remove it from customer ordering without deleting historical order data.`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, type: 'ARCHIVE', item: null })}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="btn"
                style={{
                  backgroundColor: confirmModal.type === 'DELETE' ? '#dc2626' : '#0f172a',
                  color: '#ffffff'
                }}
              >
                {confirmModal.type === 'DELETE'
                  ? 'Confirm Delete'
                  : confirmModal.item.isArchived
                  ? 'Restore Dish'
                  : 'Archive Dish'}
              </button>
            </div>
          </div>
        </div>
      )}

    </StaffShell>
  );
};
