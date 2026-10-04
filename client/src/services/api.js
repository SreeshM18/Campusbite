/**
 * CampusBite — Centralized API Client
 * Manages REST communication with Express backend with HTTP-Only Cookie credentials.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Required for HTTP-only cookies
  };

  try {
    const response = await fetch(url, config);
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
  // Public customer menu
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

  // Staff operational menu with full inventory stats
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
