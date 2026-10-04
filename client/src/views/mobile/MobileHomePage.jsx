import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileAppHeader } from './MobileAppHeader';
import { MobileHeroBanner } from './MobileHeroBanner';
import { MobileQuickCategories } from './MobileQuickCategories';
import { MobileFoodFeed } from './MobileFoodFeed';
import { MobileBottomNav } from './MobileBottomNav';
import { initialMenuItems } from '../../data/fallbackMenu';
import { menuApi } from '../../services/api';
import { CreditCard, Sparkles, ChevronRight, Zap, Award } from 'lucide-react';

export const MobileHomePage = () => {
  const [dishes, setDishes] = useState(() => initialMenuItems);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await menuApi.getMenu();
        const items = res.data || res.menuItems || res.items || (Array.isArray(res) ? res : []);
        if (Array.isArray(items) && items.length > 0) {
          setDishes(items);
        }
      } catch (err) {
        console.warn('Using fallback mobile dishes:', err);
      }
    };
    fetchDishes();
  }, []);

  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId !== 'all') {
      navigate(`/menu?category=${encodeURIComponent(categoryId)}`);
    } else {
      navigate('/menu');
    }
  };

  const trendingDishes = dishes.filter((d) => d.featured).slice(0, 5);
  const popularDishes = dishes.slice(5, 12);

  return (
    <div
      className="mobile-app-view"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--color-canvas)',
        paddingBottom: '5.5rem'
      }}
    >
      {/* 1. Mobile App Top Bar */}
      <MobileAppHeader />

      {/* Main Mobile Feed Body */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          padding: '1rem'
        }}
      >
        {/* 2. Mobile Promo Carousel Banner */}
        <MobileHeroBanner />

        {/* 3. Story Circles Category Selector */}
        <MobileQuickCategories
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 4. Quick Campus Wallet & Meal Pass Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            borderRadius: 'var(--radius-lg, 16px)',
            padding: '1rem 1.15rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-xs)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/profile')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 107, 0, 0.2)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CreditCard size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Student Meal Pass Active</div>
              <div style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Tap to view balance & recharge</div>
            </div>
          </div>
          <ChevronRight size={18} color="#94A3B8" />
        </div>

        {/* 5. Trending Today Feed */}
        <MobileFoodFeed dishes={trendingDishes} title="🔥 Trending on Campus" />

        {/* 6. Popular Dishes Feed */}
        <MobileFoodFeed dishes={popularDishes} title="⭐ Chef Recommendations" />
      </div>

      {/* 7. Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileHomePage;
