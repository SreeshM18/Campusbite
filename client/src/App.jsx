import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { StaffRoute } from './components/common/StaffRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { StaffDashboardPage } from './pages/StaffDashboardPage';
import { StaffOrderDetailPage } from './pages/StaffOrderDetailPage';
import { StaffMenuPage } from './pages/StaffMenuPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { DesignSystemPage } from './pages/DesignSystemPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppShell>
            <Routes>
              {/* Public Customer Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/design-system" element={<DesignSystemPage />} />

              {/* Authenticated Customer Routes */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderTrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:id/success"
                element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Staff Operational Routes */}
              <Route path="/staff" element={<Navigate to="/staff/orders" replace />} />
              <Route
                path="/staff/orders"
                element={
                  <StaffRoute>
                    <StaffDashboardPage />
                  </StaffRoute>
                }
              />
              <Route
                path="/staff/orders/:id"
                element={
                  <StaffRoute>
                    <StaffOrderDetailPage />
                  </StaffRoute>
                }
              />
              <Route
                path="/staff/menu"
                element={
                  <StaffRoute>
                    <StaffMenuPage />
                  </StaffRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AppShell>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
