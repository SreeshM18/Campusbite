import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'campusbite_cart_v2';
const PICKUP_STORAGE_KEY = 'campusbite_pickup_type';

export const PICKUP_OPTIONS = [
  { id: 'immediate', label: 'Immediate (~10-15 mins)', shortLabel: 'Immediate', delayMinutes: 10 },
  { id: '15mins', label: 'In 15 Minutes', shortLabel: '15 Mins', delayMinutes: 15 },
  { id: '30mins', label: 'In 30 Minutes', shortLabel: '30 Mins', delayMinutes: 30 },
  { id: '45mins', label: 'In 45 Minutes', shortLabel: '45 Mins', delayMinutes: 45 },
  { id: '1hour', label: 'In 1 Hour', shortLabel: '1 Hour', delayMinutes: 60 }
];

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pickupType, setPickupType] = useState(() => {
    return localStorage.getItem(PICKUP_STORAGE_KEY) || 'immediate';
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(PICKUP_STORAGE_KEY, pickupType);
    } catch (e) {
      console.warn('Could not save pickupType to localStorage:', e);
    }
  }, [pickupType]);

  const addItem = (menuItem, quantity = 1) => {
    if (!menuItem || !menuItem._id) return;
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i._id === menuItem._id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            image: menuItem.image,
            category: menuItem.category,
            foodType: menuItem.foodType,
            preparationTime: menuItem.preparationTime || 15,
            quantity
          }
        ];
      }
    });
  };

  const updateQuantity = (menuItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === menuItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (menuItemId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== menuItemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Calculate formatted pickup timing string
  const getFormattedPickupTime = () => {
    const selected = PICKUP_OPTIONS.find((p) => p.id === pickupType) || PICKUP_OPTIONS[0];
    const targetDate = new Date(Date.now() + selected.delayMinutes * 60000);
    const timeString = targetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${selected.label} (Ready around ${timeString})`;
  };

  const value = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    pickupType,
    setPickupType,
    pickupOptions: PICKUP_OPTIONS,
    getFormattedPickupTime,
    isCartDrawerOpen,
    setIsCartDrawerOpen
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
