import React from 'react';
import useCartStore from '../../../store/useCartStore';

const BottomCartBar = ({ onCheckout, currentStep }) => {
  const cart = useCartStore(state => state.cart);
  const cartTotal = useCartStore(state => state.cartTotal());

  if (cart.length === 0 || currentStep !== 2) return null;

  // Generate item summary for desktop
  const itemSummary = cart.map(item => `${item.itemName} × ${item.quantity}`).join(' · ');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-black/5 p-4 z-40">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Mobile: Stacked, Desktop: Row */}
        <div className="flex items-center gap-2 mb-3 md:mb-0 text-sm font-bold text-neo-charcoal shrink-0">
          <span className="bg-neo-cream px-2 py-1 rounded">🛍️ {cart.length} items</span>
          <span className="md:hidden">·</span>
          <span className="md:hidden text-lg">₹{cartTotal.toFixed(0)}</span>
        </div>
        
        <div className="hidden md:block flex-grow text-sm text-neo-charcoal/60 truncate px-4">
          {itemSummary}
        </div>
        
        <div className="flex items-center gap-6 shrink-0">
          <span className="hidden md:block text-xl font-bold text-neo-charcoal">
            ₹{cartTotal.toFixed(0)}
          </span>
          <button 
            onClick={onCheckout}
            className="w-full md:w-auto md:px-8 bg-neo-red hover:bg-neo-red-dark text-white rounded-xl py-3 md:py-4 flex items-center justify-center gap-2 font-bold transition-transform active:scale-95"
          >
            Go to cart <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomCartBar;
