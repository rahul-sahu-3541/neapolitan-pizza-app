import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import * as api from './services/api';
import useCartStore from './store/useCartStore';

// Mock the API calls
vi.mock('./services/api', () => ({
  placeOrder: vi.fn(),
  fetchMenu: vi.fn(),
  trackOrder: vi.fn()
}));

// Mock WebSocket
vi.mock('./services/websocket', () => ({
  connectToOrderUpdates: vi.fn(),
  disconnectWebSocket: vi.fn(),
  createStompClient: vi.fn(() => ({
    activate: vi.fn(),
    deactivate: vi.fn()
  }))
}));

import { BrowserRouter } from 'react-router-dom';

describe('Pizza Order Flow', () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useCartStore.setState({
      guest: { name: '', phone: '', orderType: 'DINE_IN', tableNumber: '', deliveryAddress: '' },
      cart: [],
      currentOrderNumber: null,
      currentOrderToken: null
    });
    vi.clearAllMocks();
    
    api.fetchMenu.mockResolvedValue({
      categories: [{ id: 1, name: 'Pizze', items: [{ id: 1, name: 'Margherita', basePrice: 329 }] }],
      availableToppings: [{ id: 1, name: 'Extra Cheese', price: 50 }]
    });
  });

  it('places an order and reaches the final Live Tracker page', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Step 1: Guest Details
    expect(screen.getByText(/Your next favorite.*pizza starts here/i)).toBeInTheDocument();
    
    // Fill form
    const nameInput = screen.getByPlaceholderText(/e.g. Alex Morgan/i);
    const phoneInput = screen.getByPlaceholderText(/\+91 98765 43210/i);
    
    await user.type(nameInput, 'Test User');
    await user.type(phoneInput, '9876543210');
    
    const exploreButton = screen.getByText(/Explore the menu/i);
    await user.click(exploreButton);

    // Step 2: Menu Grid
    await waitFor(() => {
      expect(screen.getByText(/Good evening, Test/i)).toBeInTheDocument();
    });

    // Add Margherita to cart
    const addButton = screen.getAllByText(/\+ Add/i)[0];
    await user.click(addButton);

    // Pizza Customizer modal opens
    await waitFor(() => {
      expect(screen.getByText(/Artisan Add-ons/i)).toBeInTheDocument();
    });

    // Confirm adding to order
    const addToOrderBtn = screen.getByText(/Add to Order/i);
    await user.click(addToOrderBtn);

    // Click checkout in the bottom bar
    const checkoutBarBtn = screen.getByText(/Go to cart/i);
    await user.click(checkoutBarBtn);
    
    screen.debug(undefined, 300000);

    // Step 3: Order Summary
    await waitFor(() => {
      expect(screen.getByText(/Payment & pickup/i)).toBeInTheDocument();
    });

    // Mock successful API responses
    api.placeOrder.mockResolvedValueOnce({
      orderNumber: 'NP-TEST-123',
      orderTrackingToken: 'token-abc'
    });
    api.trackOrder.mockResolvedValue({
      status: 'RECEIVED',
      orderNumber: 'NP-TEST-123'
    });

    // Click place order
    const placeOrderBtn = screen.getAllByText(/Place order/i)[0];
    await user.click(placeOrderBtn);

    // Verify API was called with sanitized phone
    expect(api.placeOrder).toHaveBeenCalledWith(expect.objectContaining({
      customerName: 'Test User',
      customerPhone: '9876543210',
      paymentMethod: 'PAY_AT_COUNTER'
    }));

    // Step 4: Live Tracker
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('NP-TEST-123'))).toBeInTheDocument();
    });
  });
});
