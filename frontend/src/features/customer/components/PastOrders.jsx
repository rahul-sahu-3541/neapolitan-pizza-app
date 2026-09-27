import React, { useState, useEffect } from 'react';
import useCartStore from '../../../store/useCartStore';
import { trackOrder } from '../../../services/api';
import { Clock, History, PackageCheck, Pizza } from 'lucide-react';

const PastOrders = ({ onBack, onViewLiveTracker }) => {
  const { orderHistory, setCurrentOrder } = useCartStore();
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!orderHistory || orderHistory.length === 0) {
        setLoading(false);
        return;
      }
      
      try {
        // Fetch real-time status for all orders in history
        const promises = orderHistory.map(entry => 
          trackOrder(entry.orderNumber, entry.token).catch(() => null)
        );
        const results = await Promise.all(promises);
        
        // Filter out any that failed (e.g. invalid token) and sort by date
        const validOrders = results.filter(r => r !== null).sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrdersData(validOrders);
      } catch (err) {
        console.error("Failed to load order history", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [orderHistory]);

  const handleReopenTracker = (orderNumber, token) => {
    setCurrentOrder(orderNumber, token);
    onViewLiveTracker();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RECEIVED': return 'bg-blue-100 text-blue-700';
      case 'PREPARING': return 'bg-yellow-100 text-yellow-700';
      case 'IN_OVEN': return 'bg-orange-100 text-orange-700';
      case 'READY': return 'bg-green-100 text-green-700';
      case 'CASH_COLLECTED': return 'bg-emerald-100 text-emerald-700';
      case 'COMPLETED': return 'bg-gray-100 text-gray-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <History className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold">Loading your order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 min-h-[80vh] animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-neo-red border border-gray-100">
          <History size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-neo-charcoal">My Past Orders</h2>
          <p className="text-gray-500 text-sm font-medium">View your previous orders and check active tracking.</p>
        </div>
      </div>

      {ordersData.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Pizza size={40} />
          </div>
          <h3 className="text-lg font-bold text-neo-charcoal mb-2">No past orders yet!</h3>
          <p className="text-gray-500 mb-6 text-sm">Your order history is securely saved on this device. When you place an order, it will show up here.</p>
          <button 
            onClick={onBack}
            className="bg-neo-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-transform active:scale-95 shadow-lg shadow-red-500/30"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {ordersData.map((order) => {
            const historyEntry = orderHistory.find(h => h.orderNumber === order.orderNumber);
            const isCompleted = order.status === 'COMPLETED' || order.status === 'CANCELLED';
            
            return (
              <div key={order.orderNumber} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 relative overflow-hidden group">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">
                        {new Date(order.createdAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-xl font-black text-neo-charcoal">Order {order.orderNumber}</div>
                    </div>
                    
                    <div className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm text-gray-600 font-medium">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-bold text-neo-charcoal">₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-500 text-sm">Total Amount</span>
                      <span className="font-black text-lg text-neo-charcoal">₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col justify-end gap-3 sm:w-40 shrink-0">
                  {!isCompleted && (
                    <button 
                      onClick={() => handleReopenTracker(order.orderNumber, historyEntry.token)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      <Clock size={16} /> Track
                    </button>
                  )}
                  {isCompleted && (
                    <div className="flex-1 bg-gray-50 text-gray-400 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm cursor-not-allowed">
                      <PackageCheck size={16} /> Delivered
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PastOrders;
