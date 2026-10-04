import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MobileAppHeader } from './MobileAppHeader';
import { MobileCategoryTabs } from './MobileCategoryTabs';
import { MobileFloatingCard } from './MobileFloatingCard';
import { MobileHeroBanner } from './MobileHeroBanner';
import { MobileBottomNav } from './MobileBottomNav';
import { initialMenuItems } from '../../data/fallbackMenu';
import { menuApi } from '../../services/api';
import { ChevronRight, Sparkles, CreditCard } from 'lucide-react';

export const MobileHomePage = () => {
  const [dishes, setDishes] = useState(() => initialMenuItems);
  const [activeTab, setActiveTab] = useState('all');
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

  // Filter dishes by active tab
  const filteredDishes =
    activeTab === 'all'
      ? dishes
      : dishes.filter(
          (d) =>
            d.category?.toLowerCase() === activeTab.toLowerCase() ||
            (activeTab === 'Healthy' && (d.dietary === 'veg' || d.category === 'Healthy'))
        );

  const displayDishes = filteredDishes.slice(0, 10);

  return (
    <div
      className="mobile-app-view"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--color-canvas, #f8fafc)',
        paddingBottom: '5.5rem'
      }}
    >
      {/* 1. Header (Menu + Location + "Delicious food for you" + Search) */}
      <MobileAppHeader />

      {/* 2. Horizontal Underlined Tabs + See More */}
      <div style={{ padding: '0 1.25rem 0.5rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <MobileCategoryTabs activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
          <Link
            to="/menu"
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#FA4A0C',
              textDecoration: 'none',
              marginLeft: '0.75rem',
              whiteSpace: 'nowrap'
            }}
          >
            see more
          </Link>
        </div>
      </div>

      {/* 3. 2-Column Grid of Signature Elevated Floating Cards */}
      <div style={{ padding: '0 1rem 1rem 1rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '1rem',
            marginTop: '0.5rem'
          }}
        >
          {displayDishes.map((dish) => (
            <MobileFloatingCard key={dish._id || dish.id} dish={dish} />
          ))}
        </div>
      </div>

      {/* 4. Promo Carousel Banner */}
      <div style={{ padding: '0.5rem 1rem 1rem 1rem' }}>
        <MobileHeroBanner />
      </div>

      {/* 5. Campus Meal Pass & Wallet Card */}
      <div style={{ padding: '0 1rem 1.5rem 1rem' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            borderRadius: '22px',
            padding: '1.15rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/profile')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(250, 74, 12, 0.2)',
                color: '#FA4A0C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CreditCard size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem' }}>Student Meal Pass Active</div>
              <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>Tap to view balance & recharge</div>
            </div>
          </div>
          <ChevronRight size={18} color="#94A3B8" />
        </div>
      </div>

      {/* 6. Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
};

export default MobileHomePage;
