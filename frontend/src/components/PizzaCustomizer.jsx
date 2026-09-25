import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const PizzaCustomizer = ({ item, availableToppings, onClose }) => {
  const addToCart = useCartStore(state => state.addToCart);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [subtotal, setSubtotal] = useState(item?.basePrice || 0);

  useEffect(() => {
    if (item) {
      const toppingsPrice = selectedToppings.reduce((sum, top) => sum + top.price, 0);
      setSubtotal((item.basePrice + toppingsPrice) * quantity);
    }
  }, [item, selectedToppings, quantity]);

  if (!item) return null;

  const handleToggleTopping = (topping) => {
    const isSelected = selectedToppings.find(t => t.id === topping.id);
    if (isSelected) {
      setSelectedToppings(selectedToppings.filter(t => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      menuItemId: item.id,
      itemName: item.name,
      unitPrice: item.basePrice,
      quantity,
      subtotal,
      toppings: selectedToppings
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-8 duration-300 flex flex-col max-h-[90vh]">
        
        <div className="relative h-48 sm:h-56 shrink-0">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-5">
            <h2 className="text-3xl font-serif text-white font-bold">{item.name}</h2>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full p-2 text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-grow">
          <p className="text-gray-600 mb-4">{item.description}</p>

          <h3 className="font-bold text-lg mb-3 border-b pb-2">Artisan Add-ons</h3>
          <div className="space-y-3">
            {availableToppings.map(topping => {
              const isSelected = selectedToppings.some(t => t.id === topping.id);
              return (
                <label key={topping.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${isSelected ? 'border-neo-red bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 accent-neo-red rounded text-neo-red focus:ring-neo-red"
                      checked={isSelected}
                      onChange={() => handleToggleTopping(topping)}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 flex items-center gap-2">
                        {topping.name}
                        <span className={`w-2 h-2 border border-gray-400 flex items-center justify-center bg-white rounded-full`}>
                          <span className={`w-1 h-1 rounded-full ${topping.dietaryType === 'VEG' ? 'bg-green-600' : 'bg-red-600'}`}></span>
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-700">+₹{topping.price}</span>
                </label>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <span className="font-bold text-gray-700">Quantity</span>
            <div className="flex items-center gap-4 bg-gray-100 rounded-full px-2 py-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-xl hover:text-neo-red transition-colors"
              >-</button>
              <span className="font-bold w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-xl hover:text-neo-red transition-colors"
              >+</button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t shrink-0">
          <button 
            onClick={handleAddToCart}
            className="w-full bg-neo-red hover:bg-neo-red-dark text-white font-bold py-4 px-4 rounded-xl shadow-lg transition-colors text-lg flex justify-between items-center"
          >
            <span>Add to Order</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCustomizer;
