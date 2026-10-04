import React, { useRef } from 'react';
import { Search, X, Sparkles, Coffee, Utensils, Sandwich, IceCream, Zap, Clock, Tag } from 'lucide-react';
import { FoodTypeIndicator } from '../ui/FoodTypeIndicator';

export const CATEGORIES = [
  { id: 'ALL', label: 'All Foods', icon: Sparkles },
  { id: 'BREAKFAST', label: 'Breakfast', icon: Coffee },
  { id: 'MEALS', label: 'Meals & Biryani', icon: Utensils },
  { id: 'FAST_FOOD', label: 'Fast Food & Wraps', icon: Sandwich },
  { id: 'SNACKS', label: 'Snacks & Bakery', icon: Sandwich },
  { id: 'BEVERAGES', label: 'Juices & Drinks', icon: Coffee },
  { id: 'DESSERTS', label: 'Desserts', icon: IceCream },
  { id: 'HEALTHY', label: 'Healthy Bowls', icon: Zap }
];

export const SUBCATEGORIES_BY_CATEGORY = {
  BREAKFAST: [
    { id: 'ALL', label: 'All Breakfast' },
    { id: 'Idli & Vada', label: 'Idli & Vada' },
    { id: 'Dosa & Uttapam', label: 'Dosa & Uttapam' },
    { id: 'Pongal & Poori', label: 'Pongal & Poori' },
    { id: 'Breakfast Bowls', label: 'Breakfast Bowls' },
    { id: 'Egg Specials', label: 'Egg Specials' }
  ],
  MEALS: [
    { id: 'ALL', label: 'All Meals' },
    { id: 'South Indian Thali', label: 'South Indian Thali' },
    { id: 'Rice & Biryani', label: 'Rice & Biryani' },
    { id: 'Indo-Chinese Wok', label: 'Indo-Chinese Wok' },
    { id: 'North Indian Curries', label: 'North Indian Curries' },
    { id: 'South Indian Curries', label: 'South Indian Curries' }
  ],
  FAST_FOOD: [
    { id: 'ALL', label: 'All Fast Food' },
    { id: 'Burgers', label: 'Burgers' },
    { id: 'Sandwiches', label: 'Sandwiches' },
    { id: 'Kathi Rolls', label: 'Kathi Rolls' },
    { id: 'Campus Pizza', label: 'Campus Pizza' },
    { id: 'Fries & Finger Food', label: 'Fries & Sides' }
  ],
  SNACKS: [
    { id: 'ALL', label: 'All Snacks' },
    { id: 'Hot Fried Snacks', label: 'Hot Fried Snacks' },
    { id: 'Bakery & Puffs', label: 'Bakery & Puffs' },
    { id: 'Street Food Chaat', label: 'Street Chaat' },
    { id: 'South Indian Crisps', label: 'Traditional Crisps' }
  ],
  BEVERAGES: [
    { id: 'ALL', label: 'All Drinks' },
    { id: 'Fresh Pressed Juices', label: 'Fresh Juices' },
    { id: 'Milkshakes', label: 'Milkshakes' },
    { id: 'Cold Coolers', label: 'Cold Coolers' },
    { id: 'Hot Chai & Coffee', label: 'Hot Chai & Coffee' }
  ],
  DESSERTS: [
    { id: 'ALL', label: 'All Desserts' },
    { id: 'Traditional Sweets', label: 'Traditional Sweets' },
    { id: 'Ice Cream Sundaes', label: 'Ice Cream Sundaes' },
    { id: 'Pastries & Brownies', label: 'Pastries & Brownies' }
  ],
  HEALTHY: [
    { id: 'ALL', label: 'All Healthy' },
    { id: 'Salads & Bowls', label: 'Salads & Bowls' },
    { id: 'Protein Boosters', label: 'Protein Boosters' }
  ]
};

/**
 * CategoryNav Component
 * Handles instant search, dietary filtering, category tabs, and quick campus filters.
 * Built with rock-solid flexbox alignment to prevent any icon displacement or mobile layout shifts.
 */
export const CategoryNav = ({
  activeCategory = 'ALL',
  onSelectCategory,
  activeSubcategory = 'ALL',
  onSelectSubcategory,
  activeFoodType = 'ALL',
  onSelectFoodType,
  activeQuickFilter = 'ALL',
  onSelectQuickFilter,
  onResetAll,
  searchQuery = '',
  onSearchChange,
  totalResults = null
}) => {
  const searchInputRef = useRef(null);

  const handleClearSearch = () => {
    onSearchChange('');
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && searchQuery) {
      handleClearSearch();
    }
  };

  const currentSubcategories = SUBCATEGORIES_BY_CATEGORY[activeCategory] || null;

  return (
    <div
      className="category-nav-wrapper"
      style={{
        marginBottom: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem'
      }}
    >
      {/* 1. Search Bar & Dietary Filter Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}
      >
        {/* Search Input Container — True Flexbox Centering */}
        <div
          role="search"
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: '1 1 280px',
            maxWidth: '540px',
            height: '46px',
            borderRadius: '100px',
            backgroundColor: 'var(--color-surface)',
            border: '1.5px solid var(--color-border)',
            padding: '0 14px',
            gap: '10px',
            boxSizing: 'border-box',
            boxShadow: 'var(--shadow-xs)',
            transition: 'border-color 0.2s'
          }}
        >
          <Search size={18} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />

          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search 114+ campus dishes (e.g. Biryani, Dosa, Chai)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Search dishes"
            style={{
              flex: 1,
              height: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '0.92rem',
              color: 'var(--color-text-primary)',
              padding: 0,
              minWidth: 0
            }}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              style={{
                background: 'var(--color-surface-subtle)',
                border: 'none',
                color: 'var(--color-text-muted)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dietary Filter Segmented Control */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-surface)',
            padding: '3px',
            borderRadius: '100px',
            border: '1.5px solid var(--color-border)',
            boxShadow: 'var(--shadow-xs)'
          }}
          role="group"
          aria-label="Filter by dietary preference"
        >
          <button
            type="button"
            onClick={() => onSelectFoodType('ALL')}
            aria-pressed={activeFoodType === 'ALL'}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '100px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeFoodType === 'ALL' ? 'var(--color-brand-secondary)' : 'transparent',
              color: activeFoodType === 'ALL' ? '#ffffff' : 'var(--color-text-secondary)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            All Diets
          </button>

          <button
            type="button"
            onClick={() => onSelectFoodType('VEG')}
            aria-pressed={activeFoodType === 'VEG'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '0.4rem 0.85rem',
              borderRadius: '100px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeFoodType === 'VEG' ? 'var(--color-veg-bg)' : 'transparent',
              color: activeFoodType === 'VEG' ? 'var(--color-veg)' : 'var(--color-text-secondary)',
              border: activeFoodType === 'VEG' ? '1px solid var(--color-veg-border)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <FoodTypeIndicator isVeg={true} size="sm" />
            <span>Pure Veg</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectFoodType('NON_VEG')}
            aria-pressed={activeFoodType === 'NON_VEG'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '0.4rem 0.85rem',
              borderRadius: '100px',
              fontSize: '0.82rem',
              fontWeight: 700,
              backgroundColor: activeFoodType === 'NON_VEG' ? 'var(--color-nonveg-bg)' : 'transparent',
              color: activeFoodType === 'NON_VEG' ? 'var(--color-nonveg)' : 'var(--color-text-secondary)',
              border: activeFoodType === 'NON_VEG' ? '1px solid var(--color-nonveg-border)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <FoodTypeIndicator isVeg={false} size="sm" />
            <span>Non-Veg</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Category Horizontal Scrolling Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
        role="tablist"
        aria-label="Canteen food categories"
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '100px',
                fontSize: '0.86rem',
                fontWeight: isSelected ? 800 : 600,
                backgroundColor: isSelected ? 'var(--color-brand-primary)' : 'var(--color-surface)',
                color: isSelected ? '#ffffff' : 'var(--color-text-secondary)',
                border: isSelected ? '1.5px solid var(--color-brand-primary)' : '1.5px solid var(--color-border)',
                boxShadow: isSelected ? 'var(--shadow-warm)' : 'var(--shadow-xs)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer'
              }}
            >
              <Icon size={15} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Subcategories (Shown when a category with subcategories is active) */}
      {currentSubcategories && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            overflowX: 'auto',
            padding: '2px 0',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          role="group"
          aria-label="Subcategories"
        >
          {currentSubcategories.map((sub) => {
            const isSubSelected = activeSubcategory === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => onSelectSubcategory(sub.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '100px',
                  fontSize: '0.78rem',
                  fontWeight: isSubSelected ? 800 : 500,
                  backgroundColor: isSubSelected ? 'var(--color-surface-sunken)' : 'var(--color-surface-subtle)',
                  color: isSubSelected ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                  border: isSubSelected ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {sub.label}
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Quick Filters & Result Counter on One Compact Line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          paddingTop: '2px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <button
            type="button"
            onClick={() => onSelectQuickFilter(activeQuickFilter === 'under50' ? 'ALL' : 'under50')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.25rem 0.65rem',
              borderRadius: '100px',
              fontSize: '0.76rem',
              fontWeight: 700,
              backgroundColor: activeQuickFilter === 'under50' ? '#ecfdf5' : 'var(--color-surface)',
              color: activeQuickFilter === 'under50' ? '#047857' : 'var(--color-text-secondary)',
              border: activeQuickFilter === 'under50' ? '1px solid #10b981' : '1px solid var(--color-border)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Tag size={11} /> <span>Under ₹50</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectQuickFilter(activeQuickFilter === 'fastprep' ? 'ALL' : 'fastprep')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.25rem 0.65rem',
              borderRadius: '100px',
              fontSize: '0.76rem',
              fontWeight: 700,
              backgroundColor: activeQuickFilter === 'fastprep' ? '#eff6ff' : 'var(--color-surface)',
              color: activeQuickFilter === 'fastprep' ? '#1d4ed8' : 'var(--color-text-secondary)',
              border: activeQuickFilter === 'fastprep' ? '1px solid #3b82f6' : '1px solid var(--color-border)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Clock size={11} /> <span>Ready &lt; 10m</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectQuickFilter(activeQuickFilter === 'featured' ? 'ALL' : 'featured')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '0.25rem 0.65rem',
              borderRadius: '100px',
              fontSize: '0.76rem',
              fontWeight: 700,
              backgroundColor: activeQuickFilter === 'featured' ? '#fff7ed' : 'var(--color-surface)',
              color: activeQuickFilter === 'featured' ? '#c2410c' : 'var(--color-text-secondary)',
              border: activeQuickFilter === 'featured' ? '1px solid #f97316' : '1px solid var(--color-border)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            <Sparkles size={11} /> <span>Specials</span>
          </button>
        </div>

        {/* Total results count & Reset */}
        {totalResults !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <span>
              Showing <strong style={{ color: 'var(--color-text-primary)' }}>{totalResults}</strong> dishes
            </span>
            {(activeCategory !== 'ALL' || (activeSubcategory && activeSubcategory !== 'ALL') || activeFoodType !== 'ALL' || activeQuickFilter !== 'ALL' || searchQuery) && (
              <button
                type="button"
                onClick={onResetAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-brand-primary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryNav;
