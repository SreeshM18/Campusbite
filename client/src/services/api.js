/**
 * CampusBite — Centralized Hybrid API Client
 * Primary: Real-time REST communication with Express & MongoDB backend via HTTP-Only Cookies.
 * Fallback: Self-healing client-side operational simulation if deployed on static host (e.g. Netlify) without backend attached.
 */

import { initialMenuItems } from '../data/fallbackMenu';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// In-Memory / LocalStorage Mock Database for Standalone Static Previews
const STORAGE_KEYS = {
  USER: 'cb_demo_user',
  MENU: 'cb_demo_menu',
  ORDERS: 'cb_demo_orders'
};

function getLocalStore(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setLocalStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[Storage Error]', e);
  }
}

// Initialize seed menu with deterministic ObjectIds
function getInitMenu() {
  const existing = getLocalStore(STORAGE_KEYS.MENU, null);
  if (existing && Array.isArray(existing) && existing.length > 0) return existing;

  const initialized = initialMenuItems.map((item, idx) => ({
    _id: `dish_${String(idx + 1).padStart(4, '0')}`,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    subCategory: item.subcategory || item.subCategory,
    foodType: item.foodType,
    imageUrl: item.image || '/images/masala_dosa.jpg',
    image: item.image || '/images/masala_dosa.jpg',
    isAvailable: item.available !== false,
    available: item.available !== false,
    prepTimeMinutes: item.preparationTime || 10,
    preparationTime: item.preparationTime || 10,
    isFeatured: !!item.featured,
    featured: !!item.featured,
    mealPeriod: item.mealPeriod || 'ALL_DAY',
    spiceLevel: item.spiceLevel || 'MILD',
    isArchived: false,
    totalOrdersCount: Math.floor(Math.random() * 40) + 5
  }));

  setLocalStore(STORAGE_KEYS.MENU, initialized);
  return initialized;
}

// Fallback Mock Request Handler
async function handleMockFallback(endpoint, options = {}) {
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body) : {};
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. Auth Handlers
  if (path === '/auth/register' && method === 'POST') {
    const user = {
      id: `user_${Date.now()}`,
      name: body.name || 'Campus Student',
      email: body.email,
      role: body.role || 'STUDENT',
      createdAt: new Date().toISOString()
    };
    setLocalStore(STORAGE_KEYS.USER, user);
    return { success: true, message: 'Account registered successfully', user };
  }

  if (path === '/auth/login' && method === 'POST') {
    const role = body.email?.includes('staff') ? 'CANTEEN_STAFF' : body.email?.includes('faculty') ? 'FACULTY' : 'STUDENT';
    const name = role === 'CANTEEN_STAFF' ? 'Campus Chef Raman' : role === 'FACULTY' ? 'Prof. Narayanan' : body.email ? body.email.split('@')[0] : 'Sreesh M';
    const user = {
      id: `user_${Date.now()}`,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: body.email || 'student@campusbite.edu',
      role: role,
      createdAt: new Date().toISOString()
    };
    setLocalStore(STORAGE_KEYS.USER, user);
    return { success: true, message: 'Signed in successfully', user };
  }

  if (path === '/auth/logout' && method === 'POST') {
    localStorage.removeItem(STORAGE_KEYS.USER);
    return { success: true, message: 'Signed out' };
  }

  if (path === '/auth/me' && method === 'GET') {
    const user = getLocalStore(STORAGE_KEYS.USER, null);
    if (!user) {
      const err = new Error('Not authenticated');
      err.status = 401;
      throw err;
    }
    return { success: true, user };
  }

  if (path === '/auth/profile' && method === 'PATCH') {
    const currentUser = getLocalStore(STORAGE_KEYS.USER, { name: 'Student', role: 'STUDENT' });
    const updated = { ...currentUser, name: body.name || currentUser.name };
    setLocalStore(STORAGE_KEYS.USER, updated);
    return { success: true, message: 'Profile updated', user: updated };
  }

  if (path === '/auth/password' && method === 'PATCH') {
    return { success: true, message: 'Password changed successfully' };
  }

  // 2. Menu Handlers
  if (path === '/menu' || path === '/menu/staff') {
    let menu = getInitMenu();
    const category = params.get('category');
    const foodType = params.get('foodType');
    const search = params.get('search')?.toLowerCase();

    if (category && category !== 'ALL') menu = menu.filter((m) => m.category === category);
    if (foodType && foodType !== 'ALL') menu = menu.filter((m) => m.foodType === foodType);
    if (search) menu = menu.filter((m) => m.name.toLowerCase().includes(search) || m.description?.toLowerCase().includes(search));

    return {
      success: true,
      count: menu.length,
      menuItems: menu,
      items: menu
    };
  }

  if (path.startsWith('/menu/') && path.endsWith('/availability') && method === 'PATCH') {
    const id = path.split('/')[2];
    const menu = getInitMenu();
    const item = menu.find((m) => m._id === id);
    if (item) {
      item.isAvailable = body.available !== undefined ? body.available : body.availabilityStatus === 'AVAILABLE';
      item.available = item.isAvailable;
      setLocalStore(STORAGE_KEYS.MENU, menu);
    }
    return { success: true, menuItem: item };
  }

  // 3. Orders Handlers
  if (path === '/orders' && method === 'POST') {
    const menu = getInitMenu();
    const user = getLocalStore(STORAGE_KEYS.USER, { name: 'Student', role: 'STUDENT' });
    const token = `CB-${Math.floor(1000 + Math.random() * 9000)}`;

    const items = (body.items || []).map((item) => {
      const found = menu.find((m) => m._id === item.menuItem || m._id === item.id);
      return {
        menuItem: item.menuItem || item.id,
        name: item.name || found?.name || 'Delicious Dish',
        price: item.price || found?.price || 60,
        quantity: item.quantity || 1
      };
    });

    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const order = {
      _id: `ord_${Date.now()}`,
      token,
      userId: user.id || 'demo_user',
      userName: user.name || 'Student',
      userEmail: user.email || 'student@campusbite.edu',
      items,
      subtotal,
      total: subtotal,
      status: 'PENDING',
      pickupSlot: body.pickupSlot || 'Immediate (~10 mins)',
      paymentMethod: body.paymentMethod || 'UPI_DEMO',
      paymentStatus: 'COMPLETED',
      createdAt: new Date().toISOString()
    };

    const existingOrders = getLocalStore(STORAGE_KEYS.ORDERS, []);
    setLocalStore(STORAGE_KEYS.ORDERS, [order, ...existingOrders]);
    return { success: true, order, message: 'Order placed successfully' };
  }

  if (path === '/orders/my' && method === 'GET') {
    const orders = getLocalStore(STORAGE_KEYS.ORDERS, []);
    return { success: true, count: orders.length, orders };
  }

  if (path.startsWith('/orders/') && !path.includes('staff') && method === 'GET') {
    const id = path.split('/')[2];
    const orders = getLocalStore(STORAGE_KEYS.ORDERS, []);
    const order = orders.find((o) => o._id === id || o.token === id) || orders[0];
    return { success: true, order: order || null };
  }

  if (path.startsWith('/orders/') && path.endsWith('/status') && method === 'PATCH') {
    const id = path.split('/')[2];
    const orders = getLocalStore(STORAGE_KEYS.ORDERS, []);
    const order = orders.find((o) => o._id === id);
    if (order) {
      order.status = body.status;
      setLocalStore(STORAGE_KEYS.ORDERS, orders);
    }
    return { success: true, order };
  }

  if (path === '/orders/staff/all' && method === 'GET') {
    const orders = getLocalStore(STORAGE_KEYS.ORDERS, []);
    return { success: true, count: orders.length, orders };
  }

  if (path === '/orders/staff/stats' && method === 'GET') {
    const orders = getLocalStore(STORAGE_KEYS.ORDERS, []);
    return {
      success: true,
      stats: {
        pendingCount: orders.filter((o) => o.status === 'PENDING').length,
        preparingCount: orders.filter((o) => o.status === 'PREPARING').length,
        readyCount: orders.filter((o) => o.status === 'READY').length,
        completedCount: orders.filter((o) => o.status === 'COMPLETED').length
      }
    };
  }

  return { success: true, message: 'Simulated preview response' };
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include'
  };

  try {
    const response = await fetch(url, config);
    
    // If backend returns a genuine 404 on API_BASE === '/api' (static Netlify host), fallback to demo simulation
    if (response.status === 404 && API_BASE === '/api') {
      return await handleMockFallback(endpoint, options);
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      error.errors = data.errors || {};
      throw error;
    }

    return data;
  } catch (error) {
    // If network fails (no backend online) and we're in static preview, gracefully switch to client simulation
    if (API_BASE === '/api' || !import.meta.env.VITE_API_URL) {
      try {
        return await handleMockFallback(endpoint, options);
      } catch (fallbackErr) {
        if (endpoint !== '/auth/me' || fallbackErr.status !== 401) {
          console.warn(`[Fallback Handling: ${endpoint}]`, fallbackErr.message);
        }
        throw fallbackErr;
      }
    }

    if (endpoint !== '/auth/me' || error.status !== 401) {
      console.error(`[API Error: ${endpoint}]`, error.message);
    }
    throw error;
  }
}

export const authApi = {
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me', { method: 'GET' }),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PATCH', body: JSON.stringify(profileData) }),
  changePassword: (passwordData) => request('/auth/password', { method: 'PATCH', body: JSON.stringify(passwordData) })
};

export const menuApi = {
  getMenu: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.foodType && params.foodType !== 'ALL') query.append('foodType', params.foodType);
    if (params.search) query.append('search', params.search);
    if (params.available !== undefined) query.append('available', params.available);
    if (params.featured !== undefined) query.append('featured', params.featured);

    const qs = query.toString();
    return request(`/menu${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },

  getStaffMenu: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'ALL') query.append('category', params.category);
    if (params.foodType && params.foodType !== 'ALL') query.append('foodType', params.foodType);
    if (params.availabilityStatus && params.availabilityStatus !== 'ALL') query.append('availabilityStatus', params.availabilityStatus);
    if (params.featured !== undefined && params.featured !== 'ALL') query.append('featured', params.featured);
    if (params.archived !== undefined) query.append('archived', params.archived);
    if (params.search) query.append('search', params.search);

    const qs = query.toString();
    return request(`/menu/staff${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },

  getMenuItem: (id) => request(`/menu/${id}`, { method: 'GET' }),
  createMenuItem: (data) => request('/menu', { method: 'POST', body: JSON.stringify(data) }),
  updateMenuItem: (id, data) => request(`/menu/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  toggleAvailability: (id, statusOrBool) => {
    const body = typeof statusOrBool === 'string'
      ? { availabilityStatus: statusOrBool }
      : { available: statusOrBool };
    return request(`/menu/${id}/availability`, { method: 'PATCH', body: JSON.stringify(body) });
  },
  archiveMenuItem: (id, isArchived) => request(`/menu/${id}/archive`, { method: 'PATCH', body: JSON.stringify({ isArchived }) }),
  deleteMenuItem: (id) => request(`/menu/${id}`, { method: 'DELETE' }),
  bulkUpdateAvailability: (itemIds, availabilityStatus) => request('/menu/bulk/availability', {
    method: 'PATCH',
    body: JSON.stringify({ itemIds, availabilityStatus })
  })
};

export const orderApi = {
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const qs = query.toString();
    return request(`/orders/my${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getOrderById: (id) => request(`/orders/${id}`, { method: 'GET' }),
  cancelOrder: (id, reason) => request(`/orders/${id}/cancel`, { method: 'PATCH', body: JSON.stringify({ reason }) }),
  getStaffOrders: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return request(`/orders/staff/all${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
  getStaffStats: () => request('/orders/staff/stats', { method: 'GET' }),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
};
