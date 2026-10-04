import { useState, useEffect } from 'react';

/**
 * Custom hook to detect mobile vs desktop viewports
 * Supports automatic screen width detection (< 768px is mobile)
 * and allows explicit mode override ('auto' | 'mobile' | 'web')
 */
export const useDeviceView = () => {
  const [windowWidth, setWindowWidth] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200;
  });

  const [viewOverride, setViewOverride] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('cb_view_mode') || 'auto';
    }
    return 'auto';
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setViewMode = (mode) => {
    setViewOverride(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cb_view_mode', mode);
    }
  };

  const isMobile = viewOverride === 'mobile' ? true : viewOverride === 'web' ? false : windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  return {
    isMobile,
    isTablet,
    isDesktop,
    viewMode: viewOverride,
    setViewMode,
    windowWidth
  };
};

export default useDeviceView;
