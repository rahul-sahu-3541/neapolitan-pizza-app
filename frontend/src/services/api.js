import axios from 'axios';

// Use environment variable for the base URL, or default to localhost for local dev
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

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

export const updateOrderStatus = async (orderNumber, statusPayload) => {
  const response = await api.patch(`/admin/orders/${orderNumber}/status`, statusPayload);
  return response.data;
};
