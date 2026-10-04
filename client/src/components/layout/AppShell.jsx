import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../common/Navbar';
import { Footer } from '../common/Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { StickyMobileCartBar } from '../cart/StickyMobileCartBar';
import { ToastProvider } from '../ui/Toast';
import { ErrorBoundary } from '../ui/ErrorBoundary';

/**
 * CampusBite Core AppShell Layout Primitive
 * Unifies Header, Navigation, Sticky Cart, Footer, Toast notifications & Error boundaries.
 */
export const AppShell = ({ children }) => {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/staff');

  if (isStaffRoute) {
    return (
      <ErrorBoundary>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div
          className="app-shell"
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100%',
            backgroundColor: 'var(--color-canvas)',
            color: 'var(--color-text-primary)'
          }}
        >
          {/* Header Navigation */}
          <Navbar />

          {/* Side Cart Drawer */}
          <CartDrawer />

          {/* Sticky Mobile Bar */}
          <StickyMobileCartBar />

          {/* Main Dynamic Content Area */}
          <main
            id="main-content"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              width: '100%'
            }}
          >
            {children}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </ToastProvider>
    </ErrorBoundary>
  );
};
