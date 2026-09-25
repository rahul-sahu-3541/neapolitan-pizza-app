import React, { useState } from 'react';
import useCartStore from '../store/useCartStore';
import { placeOrder } from '../services/api';

const PizzaSlice = () => (
  <div className="w-12 h-12 bg-neo-red/10 rounded-xl flex items-center justify-center shrink-0">
    <span className="text-xl">🍕</span>
  </div>
);

const OrderSummary = ({ onOrderPlaced }) => {
  const { cart, cartTotal, guest, clearCart, setCurrentOrder } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState('OFFLINE');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartTotal();
  const deliveryFee = guest.orderType === 'TAKEAWAY' ? 40 : 0;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = async () => {
    setIsProcessing(true);
    setError('');
    try {
      const orderPayload = {
        customerName: guest.name,
        customerPhone: guest.phone,
        orderType: guest.orderType,
        tableNumber: guest.tableNumber,
        items: cart.map(item => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          selectedToppings: item.toppings.map(t => t.id)
        })),
        paymentMethod
      };

      const result = await placeOrder(orderPayload);
      
      setCurrentOrder(result.orderNumber, result.orderTrackingToken);
      clearCart();
      onOrderPlaced();
    } catch (err) {
      setError('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-12 pb-32 md:pb-16 animate-in fade-in slide-in-from-right duration-300">
      <div className="mb-6 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-neo-charcoal mb-1">Your order</h2>
        <p className="text-neo-charcoal/60 md:text-lg">Review your picks before we fire up the oven.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Left Column */}
        <div className="flex-grow space-y-6 md:space-y-8">
          
          {/* Items List */}
          <div className="bg-white rounded-3xl p-4 md:p-8 shadow-sm border border-black/5">
            <h3 className="text-xs font-bold text-neo-charcoal/60 tracking-wider mb-6 uppercase hidden md:block">Your Pizzas</h3>
            <div className="space-y-6">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b border-black/5 pb-6 last:border-0 last:pb-0">
                  <PizzaSlice />
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-neo-charcoal text-lg">{item.itemName}</h4>
                      <span className="font-bold text-neo-charcoal text-lg">₹{item.subtotal.toFixed(0)}</span>
                    </div>
                    <p className="text-xs md:text-sm text-neo-charcoal/60 mb-3">
                      Large · classic crust {item.toppings.length > 0 && `(+ ${item.toppings.map(t => t.name).join(', ')})`}
                    </p>
                    <div className="flex items-center gap-3 text-neo-red font-bold text-sm">
                      <button className="w-6 h-6 flex items-center justify-center">-</button>
                      <span>{item.quantity}</span>
                      <button className="w-6 h-6 flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Details */}
          <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-black/5 text-sm md:text-base">
            <h3 className="font-bold text-lg text-neo-charcoal mb-6 hidden md:block">Order summary</h3>
            <div className="flex justify-between text-neo-charcoal/60 mb-3 md:mb-4">
              <span>Subtotal</span>
              <span className="text-neo-charcoal font-medium">₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-neo-charcoal/60 mb-4 md:mb-8">
              <span>Delivery</span>
              <span className="text-neo-charcoal font-medium">₹{deliveryFee.toFixed(0)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg md:text-xl text-neo-charcoal items-center border-t border-black/5 pt-4 md:pt-6">
              <span>Total</span>
              <span className="text-neo-red">₹{grandTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 space-y-6">
          <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-black/5">
            <h3 className="font-bold text-lg md:text-xl text-neo-charcoal mb-2 md:mb-1">Payment & pickup</h3>
            <p className="text-neo-charcoal/60 text-sm mb-6 hidden md:block">Choose how you'd like to pay</p>
            
            <div className="space-y-3 mb-6 md:mb-8">
              <label className={`block rounded-2xl p-4 border transition-colors cursor-pointer ${
                paymentMethod === 'OFFLINE' ? 'bg-neo-green/10 border-neo-green text-neo-green' : 'bg-white border-black/10 text-neo-charcoal hover:bg-black/5'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${paymentMethod === 'OFFLINE' ? 'bg-neo-green' : 'border border-black/20'}`}></div>
                  <div>
                    <div className="font-bold text-sm">Cash on pickup / delivery</div>
                    <div className={`text-xs mt-0.5 ${paymentMethod === 'OFFLINE' ? 'text-neo-green/80' : 'text-neo-charcoal/50'}`}>Pay when your order arrives</div>
                  </div>
                </div>
                <input type="radio" className="hidden" checked={paymentMethod === 'OFFLINE'} onChange={() => setPaymentMethod('OFFLINE')} />
              </label>

              <label className={`block rounded-2xl p-4 border transition-colors cursor-pointer ${
                paymentMethod === 'ONLINE' ? 'bg-neo-green/10 border-neo-green text-neo-green' : 'bg-white border-black/10 text-neo-charcoal hover:bg-black/5'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${paymentMethod === 'ONLINE' ? 'bg-neo-green' : 'border border-black/20'}`}></div>
                  <div>
                    <div className="font-bold text-sm">Pay online</div>
                    <div className={`text-xs mt-0.5 ${paymentMethod === 'ONLINE' ? 'text-neo-green/80' : 'text-neo-charcoal/50'}`}>UPI · Card · Wallet</div>
                  </div>
                </div>
                <input type="radio" className="hidden" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} />
              </label>
            </div>

            <div>
              <h3 className="text-xs font-bold text-neo-charcoal/60 tracking-wider mb-3">PICKUP OR DELIVERY</h3>
              <div className="flex items-center gap-2 text-sm bg-neo-cream/50 p-3 rounded-xl border border-black/5">
                <span className="text-neo-charcoal/40">⌖</span>
                <span className="font-bold text-neo-charcoal">Pickup at Crust & Fire</span>
                <span className="text-neo-charcoal/40">·</span>
                <span className="font-bold text-neo-charcoal">25–30 min</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            {error && <div className="text-red-500 text-sm font-medium text-center mb-4">{error}</div>}
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-neo-red hover:bg-neo-red-dark text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold transition-transform active:scale-95 disabled:opacity-70 text-lg shadow-lg shadow-neo-red/20"
            >
              {isProcessing ? 'Processing...' : `Place order · ₹${grandTotal.toFixed(0)}`}
            </button>
            <div className="mt-4 text-xs text-neo-charcoal/50 space-y-1">
              <p className="flex items-center gap-1"><span className="text-[10px]">🔒</span> No payment is taken until you confirm.</p>
              <p>Pay your driver or collect in store.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-black/5 p-4 z-40">
        <div className="max-w-md mx-auto">
          {error && <div className="text-red-500 text-sm font-medium text-center mb-2">{error}</div>}
          <div className="text-xs font-bold text-neo-charcoal/60 mb-2">
            {paymentMethod === 'OFFLINE' ? 'Cash on pickup' : 'Online payment'} · Total ₹{grandTotal.toFixed(0)}
          </div>
          <button 
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-neo-red hover:bg-neo-red-dark text-white rounded-xl py-4 flex items-center justify-center gap-2 font-bold transition-transform active:scale-95 disabled:opacity-70"
          >
            {isProcessing ? 'Processing...' : 'Place order'} <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
