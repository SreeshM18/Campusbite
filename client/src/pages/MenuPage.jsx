import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CategoryNav } from '../components/menu/CategoryNav';
import { FoodCard } from '../components/menu/FoodCard';
import { FoodCardSkeleton } from '../components/menu/FoodCardSkeleton';
import { PageContainer } from '../components/ui/PageContainer';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { Sparkles, Clock, AlertCircle, RotateCcw, Utensils, Zap, MapPin } from 'lucide-react';

export const MenuPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rawMenuItems, setRawMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state with URL search params
  const activeCategory = searchParams.get('category') || 'ALL';
  const activeSubcategory = searchParams.get('sub') || 'ALL';
  const activeFoodType = searchParams.get('type') || 'ALL';
  const activeQuickFilter = searchParams.get('quick') || 'ALL';
  const searchQuery = searchParams.get('search') || '';

  // Helper to update URL search params
  const updateFilters = useCallback(
    (newCategory, newSubcategory, newFoodType, newQuickFilter, newSearch) => {
      const params = {};
      const cat = newCategory !== undefined ? newCategory : activeCategory;
      const sub = newSubcategory !== undefined ? newSubcategory : activeSubcategory;
      const type = newFoodType !== undefined ? newFoodType : activeFoodType;
      const quick = newQuickFilter !== undefined ? newQuickFilter : activeQuickFilter;
      const search = newSearch !== undefined ? newSearch : searchQuery;

      if (cat && cat !== 'ALL') params.category = cat;
      if (sub && sub !== 'ALL') params.sub = sub;
      if (type && type !== 'ALL') params.type = type;
      if (quick && quick !== 'ALL') params.quick = quick;
      if (search && search.trim() !== '') params.search = search.trim();

      setSearchParams(params, { replace: true });
    },
    [activeCategory, activeSubcategory, activeFoodType, activeQuickFilter, searchQuery, setSearchParams]
  );

  // Fetch full menu from backend API
  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await menuApi.getMenu();
      const items = res.data || res.menuItems || res.items || (Array.isArray(res) ? res : []);
      if (Array.isArray(items)) {
        setRawMenuItems(items);
      }
    } catch (err) {
      console.error('[Menu Fetch Error]:', err);
      setError(err.message || 'Unable to connect to canteen menu service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Filter menu items locally for 0ms instant search and responsive filtering across 114+ items
  const filteredItems = useMemo(() => {
    return rawMenuItems.filter((item) => {
      // 1. Primary Category Filter
      if (activeCategory !== 'ALL' && item.category !== activeCategory) {
        return false;
      }

      // 2. Subcategory Filter
      if (activeSubcategory !== 'ALL' && item.subcategory !== activeSubcategory) {
        return false;
      }

      // 3. Dietary Filter
      if (activeFoodType !== 'ALL' && item.foodType !== activeFoodType) {
        return false;
      }

      // 4. Quick Filters
      if (activeQuickFilter === 'under50' && item.price > 50) {
        return false;
      }
      if (activeQuickFilter === 'fastprep' && item.preparationTime > 10) {
        return false;
      }
      if (activeQuickFilter === 'featured' && !item.featured) {
        return false;
      }

      // 5. Search Query Filter (multi-field matching: name, description, category, subcategory)
      if (searchQuery.trim()) {
        const queryTerms = searchQuery.toLowerCase().trim().split(/\s+/);
        const targetText = `${item.name || ''} ${item.description || ''} ${item.category || ''} ${item.subcategory || ''}`.toLowerCase();
        const matchesAll = queryTerms.every((term) => targetText.includes(term));
        if (!matchesAll) {
          return false;
        }
      }

      return true;
    });
  }, [rawMenuItems, activeCategory, activeSubcategory, activeFoodType, activeQuickFilter, searchQuery]);

  // Featured / Quick Picks for Hero highlight
  const featuredItems = useMemo(() => {
    return rawMenuItems.filter((item) => item.featured && item.available !== false);
  }, [rawMenuItems]);

  // Time-aware dynamic greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.name ? user.name.split(' ')[0] : null;
    const nameStr = firstName ? `, ${firstName}` : '';

    if (hour < 12) return `Good morning${nameStr}! What's for breakfast?`;
    if (hour < 16) return `Good afternoon${nameStr}! Grab a hot lunch before break ends.`;
    return `Good evening${nameStr}! Ready for snacks & refreshments?`;
  };

  // Human-readable section heading
  const getSectionTitle = () => {
    if (searchQuery) return `Search results for "${searchQuery}"`;
    if (activeSubcategory !== 'ALL') return activeSubcategory;
    if (activeCategory !== 'ALL') {
      const titles = {
        BREAKFAST: 'South Indian Breakfast & Tiffin',
        MEALS: 'Meals, Biryani & Curries',
        FAST_FOOD: 'Burgers, Wraps & Sandwiches',
        SNACKS: 'Crispy Snacks, Chaat & Bakery',
        BEVERAGES: 'Fresh Juices, Shakes & Chai',
        DESSERTS: 'Traditional Sweets & Ice Creams',
        HEALTHY: 'Healthy Fruit & Protein Bowls'
      };
      return titles[activeCategory] || activeCategory;
    }
    return 'All 114+ Campus Canteen Dishes';
  };

  return (
    <PageContainer size="standard" paddingY="md">
      {/* 1. Context & Campus Greeting Header */}
      <div
        style={{
          marginBottom: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--color-brand-primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          <MapPin size={14} />
          <span>Central Amenities Food Court • Express Multi-Counters</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div>
            <h1 className="type-h1" style={{ color: 'var(--color-text-primary)' }}>
              {getGreeting()}
            </h1>
            <p className="type-body-lg" style={{ color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
              Pre-order ahead, skip the standing line, and pick up hot food seamlessly with your digital token.
            </p>
          </div>

          {/* Quick Pickup Guarantee Chip */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.45rem 0.85rem',
              backgroundColor: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              border: '1px solid #bbf7d0',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <Zap size={14} />
            <span>Zero Queue Express Handover</span>
          </div>
        </div>
      </div>

      {/* 2. Category Navigation, Search, Subcategory & Quick Filter Toolbar */}
      <CategoryNav
        activeCategory={activeCategory}
        onSelectCategory={(cat) => updateFilters(cat, 'ALL', undefined, undefined, undefined)}
        activeSubcategory={activeSubcategory}
        onSelectSubcategory={(sub) => updateFilters(undefined, sub, undefined, undefined, undefined)}
        activeFoodType={activeFoodType}
        onSelectFoodType={(type) => updateFilters(undefined, undefined, type, undefined, undefined)}
        activeQuickFilter={activeQuickFilter}
        onSelectQuickFilter={(quick) => updateFilters(undefined, undefined, undefined, quick, undefined)}
        onResetAll={() => updateFilters('ALL', 'ALL', 'ALL', 'ALL', '')}
        searchQuery={searchQuery}
        onSearchChange={(query) => updateFilters(undefined, undefined, undefined, undefined, query)}
        totalResults={loading ? null : filteredItems.length}
      />

      {/* 3. Error Alert State */}
      {error && (
        <div
          className="card animate-fade-in"
          style={{
            backgroundColor: 'var(--color-danger-bg)',
            borderColor: '#fecaca',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-danger)' }}>
            <AlertCircle size={22} style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.95rem' }}>Unable to load canteen menu</strong>
              <span style={{ fontSize: '0.84rem' }}>{error}</span>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={fetchMenu}
            iconBefore={<RotateCcw size={15} />}
          >
            Retry Connection
          </Button>
        </div>
      )}

      {/* 4. Featured / Quick Picks Row (Only shown when browsing all items without active text search or subcategory) */}
      {!loading && !error && activeCategory === 'ALL' && activeSubcategory === 'ALL' && activeQuickFilter === 'ALL' && !searchQuery && featuredItems.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={18} color="var(--color-brand-primary)" />
            <h2 className="type-h3" style={{ color: 'var(--color-text-primary)' }}>
              Chef&apos;s Daily Specials & Quick Picks
            </h2>
          </div>

          <div
            className="menu-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {featuredItems.slice(0, 4).map((item) => (
              <FoodCard key={`featured-${item._id}`} item={item} />
            ))}
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border-subtle)', marginTop: '2.25rem' }} />
        </section>
      )}

      {/* 5. Main Menu Grid / Loading / Empty States */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={18} color="var(--color-brand-primary)" />
            <h2 className="type-h3">{getSectionTitle()}</h2>
          </div>
          {!loading && (
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {loading ? (
          /* Loading Skeletons Grid */
          <div
            className="menu-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <FoodCardSkeleton key={n} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          /* Search / Filter Empty State */
          <EmptyState
            icon={<Utensils size={32} color="var(--color-brand-primary)" />}
            title={searchQuery ? `No dishes match "${searchQuery}"` : 'No items found in this section'}
            description={
              searchQuery
                ? 'Check your spelling or try searching for general categories like Dosa, Biryani, Juice, or Puff.'
                : 'Try adjusting your dietary filter (Pure Veg / Non-Veg) or resetting subcategories.'
            }
            action={
              <Button
                variant="primary"
                onClick={() => updateFilters('ALL', 'ALL', 'ALL', 'ALL', '')}
                iconBefore={<RotateCcw size={16} />}
              >
                Reset All Filters
              </Button>
            }
          />
        ) : (
          /* Responsive Active Food Card Grid */
          <div
            className="menu-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {filteredItems.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Responsive Grid CSS Overrides */}
      <style>{`
        @media (max-width: 640px) {
          .menu-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .menu-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 1025px) and (max-width: 1439px) {
          .menu-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (min-width: 1440px) {
          .menu-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </PageContainer>
  );
};
