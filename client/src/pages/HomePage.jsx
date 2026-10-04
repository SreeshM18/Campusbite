import React from 'react';
import { useDeviceView } from '../utils/useDeviceView';
import { WebHomePage } from '../views/web/WebHomePage';
import { MobileHomePage } from '../views/mobile/MobileHomePage';

/**
 * HomePage Adaptive Root Component
 * Automatically serves:
 * - WebHomePage (from /views/web/): Desktop landing layout inspired by Figma design
 * - MobileHomePage (from /views/mobile/): Native mobile app experience for phones & small viewports
 */
export const HomePage = () => {
  const { isMobile } = useDeviceView();

  if (isMobile) {
    return <MobileHomePage />;
  }

  return <WebHomePage />;
};

export default HomePage;
