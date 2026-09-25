import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      // Guest Details
      guest: {
        name: '',
        phone: '',
        orderType: 'DINE_IN',
        tableNumber: '',
        deliveryAddress: ''
      },
      setGuestDetails: (details) => set((state) => ({ guest: { ...state.guest, ...details } })),

      // Cart State
      cart: [],
      addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
      removeFromCart: (index) => set((state) => ({
        cart: state.cart.filter((_, i) => i !== index)
      })),
      clearCart: () => set({ cart: [] }),
      
      cartTotal: () => get().cart.reduce((total, item) => total + item.subtotal, 0),

      // Order State
      currentOrderToken: null,
      currentOrderNumber: null,
      setCurrentOrder: (orderNumber, token) => set({ currentOrderNumber: orderNumber, currentOrderToken: token }),
      clearCurrentOrder: () => set({ currentOrderNumber: null, currentOrderToken: null, cart: [] })
    }),
    {
      name: 'neapolitan-pizza-storage', // saves to localStorage
    }
  )
);

export default useCartStore;
