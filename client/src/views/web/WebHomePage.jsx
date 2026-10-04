import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebHeroFigma } from './WebHeroFigma';
import { WebCategoryBar } from './WebCategoryBar';
import { WebFoodieSection } from './WebFoodieSection';
import { WebFeaturedDishes } from './WebFeaturedDishes';
import { WebBenefitsSection } from './WebBenefitsSection';
import { WebSpecialOffers } from './WebSpecialOffers';
import { initialMenuItems } from '../../data/fallbackMenu';
import { menuApi } from '../../services/api';
import { Store, Zap, Sparkles } from 'lucide-react';

export const WebHomePage = () => {
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
        console.warn('Using fallback dishes:', err);
      }
    };
    fetchDishes();
  }, []);

  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    if (categoryId === 'all') {
      navigate('/menu');
    } else {
      navigate(`/menu?category=${encodeURIComponent(categoryId)}`);
    }
  };

  const featuredItems = dishes.filter((i) => i.featured).slice(0, 8);

  return (
    <div
      className="container web-view-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3.5rem',
        paddingTop: '1rem',
        paddingBottom: '4rem'
      }}
    >
      {/* Top Live Campus Canteen Status Ribbon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-lg, 16px)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xs)',
          fontSize: '0.9rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
              animation: 'pulse 2s infinite'
            }}
          />
          <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
            Central Canteen & Food Court Open
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--text-secondary)' }}>07:30 AM – 09:30 PM (All Counters Active)</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
            <Store size={16} color="var(--brand-primary)" /> Express Counter #3 Active
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#10B981' }}>
            <Zap size={16} /> Avg Prep: ~12-15m
          </span>
        </div>
      </div>

      {/* 1. Figma Inspired Emerald Hero Section */}
      <WebHeroFigma />

      {/* 2. Signature Foodie App UI Kit Showcase (Floating Dish Plates) */}
      <WebFoodieSection dishes={dishes} />

      {/* 3. Category Navigation Bar */}
      <WebCategoryBar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* 4. Special Deals & Promotional Cards */}
      <WebSpecialOffers />

      {/* 5. Featured Campus Favorites Grid */}
      <WebFeaturedDishes dishes={featuredItems} />

      {/* 6. Benefits & Trust Matrix */}
      <WebBenefitsSection />
    </div>
  );
};

export default WebHomePage;
