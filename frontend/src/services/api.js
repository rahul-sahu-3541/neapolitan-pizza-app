import axios from 'axios';

export const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  return 'http://localhost:8080/api';
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(config => {
  if (config.url.startsWith('/admin')) {
    const adminKey = localStorage.getItem('adminKey');
    if (adminKey) {
      config.headers['X-Admin-Key'] = adminKey;
    }
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminKey');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export const fetchMenu = async () => {
  const response = await api.get('/menu');
  return response.data;
};

export const placeOrder = async (orderPayload) => {
  const response = await api.post('/orders', orderPayload);
  return response.data;
};

export const trackOrder = async (orderNumber, token) => {
  const response = await api.get(`/orders/${orderNumber}?token=${token}`);
  return response.data;
};

// Admin endpoints
export const fetchActiveOrders = async () => {
  const response = await api.get('/admin/orders?activeOnly=true');
  return response.data;
};

export const fetchAllOrders = async () => {
  const response = await api.get('/admin/orders?activeOnly=false');
  return response.data;
};

export const updateOrderStatus = async (orderNumber, statusPayload) => {
  const response = await api.patch(`/admin/orders/${orderNumber}/status`, statusPayload);
  return response.data;
};

export const fetchAdminAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

export const createMenuItem = async (menuPayload) => {
  const response = await api.post('/admin/menu/items', menuPayload);
  return response.data;
};

export const updateMenuItem = async (id, menuPayload) => {
  const response = await api.put(`/admin/menu/items/${id}`, menuPayload);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await api.delete(`/admin/menu/items/${id}`);
  return response.data;
};
