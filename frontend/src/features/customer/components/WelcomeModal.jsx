import React, { useState } from 'react';
import useCartStore from '../../../store/useCartStore';

const WelcomeModal = ({ isOpen, onClose }) => {
  const { guest, setGuestDetails } = useCartStore();
  const [formData, setFormData] = useState({
    name: guest.name || '',
    phone: guest.phone || '',
    orderType: guest.orderType || 'DINE_IN',
    tableNumber: guest.tableNumber || '',
  });

  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    
    setGuestDetails(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-neo-red p-6 text-center">
          <h2 className="text-3xl font-serif text-white font-bold mb-2">Benvenuto!</h2>
          <p className="text-neo-cream/90 text-sm">Enter your details for live wood-fired tracking</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-100 text-red-700 rounded text-sm font-medium">{error}</div>}
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-neo-red focus:border-neo-red outline-none transition-all"
              placeholder="e.g. Rahul Sharma"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number (+91)</label>
            <input 
              type="tel" 
              maxLength="10"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
              className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-neo-red focus:border-neo-red outline-none transition-all"
              placeholder="10-digit number"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Order Type</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${formData.orderType === 'DINE_IN' ? 'border-neo-red bg-red-50 text-neo-red' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                <input type="radio" name="orderType" value="DINE_IN" className="hidden" 
                  checked={formData.orderType === 'DINE_IN'} onChange={() => setFormData({...formData, orderType: 'DINE_IN'})} />
                <span className="text-2xl mb-1">🍽️</span>
                <span className="font-medium text-sm">Dine-In</span>
              </label>
              <label className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${formData.orderType === 'TAKEAWAY' ? 'border-neo-red bg-red-50 text-neo-red' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                <input type="radio" name="orderType" value="TAKEAWAY" className="hidden" 
                  checked={formData.orderType === 'TAKEAWAY'} onChange={() => setFormData({...formData, orderType: 'TAKEAWAY'})} />
                <span className="text-2xl mb-1">🛍️</span>
                <span className="font-medium text-sm">Takeaway</span>
              </label>
            </div>
          </div>

          {formData.orderType === 'DINE_IN' && (
            <div className="animate-in slide-in-from-top-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Table Number</label>
              <input 
                type="text" 
                value={formData.tableNumber}
                onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
                className="w-full border-gray-300 rounded-lg p-3 bg-gray-50 focus:ring-2 focus:ring-neo-red focus:border-neo-red outline-none"
                placeholder="e.g. Table 4"
              />
            </div>
          )}

          <button type="submit" className="w-full mt-4 bg-neo-red hover:bg-neo-red-dark text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-colors text-lg">
            Start Ordering
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeModal;
