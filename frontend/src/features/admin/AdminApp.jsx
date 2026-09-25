import React, { useState, useEffect } from 'react';
import { fetchActiveOrders, updateOrderStatus } from '../../services/api';

const ORDER_STATUSES = [
  'RECEIVED',
  'PREPARING',
  'BAKING',
  'READY_FOR_PICKUP',
  'COMPLETED',
  'CANCELLED'
];

const AdminApp = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const data = await fetchActiveOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderNumber, newStatus) => {
    try {
      await updateOrderStatus(orderNumber, { status: newStatus });
      loadOrders(); // Refresh instantly
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'RECEIVED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PREPARING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'BAKING': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'READY_FOR_PICKUP': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading && orders.length === 0) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-bold text-xl">Loading kitchen display...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kitchen Display System</h1>
          <div className="text-sm text-gray-500 font-medium">Auto-refreshing every 5s</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['RECEIVED', 'PREPARING', 'BAKING', 'READY_FOR_PICKUP'].map(columnStatus => (
            <div key={columnStatus} className="bg-gray-50/50 rounded-2xl p-4 border border-gray-200 flex flex-col h-[80vh]">
              <h2 className="font-bold text-gray-700 mb-4 pb-2 border-b border-gray-200 uppercase text-sm tracking-wider">
                {columnStatus.replace(/_/g, ' ')}
                <span className="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                  {orders.filter(o => o.status === columnStatus).length}
                </span>
              </h2>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {orders
                  .filter(o => o.status === columnStatus)
                  .map(order => (
                  <div key={order.orderNumber} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${getStatusColor(order.status).split(' ')[0].replace('bg-', 'border-')}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-lg">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">{order.customerName}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-gray-500 uppercase">{order.orderType.replace('_', ' ')}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-bold text-gray-700">{item.quantity}x</span> {item.itemName}
                          {item.toppings && item.toppings.length > 0 && (
                            <div className="text-xs text-gray-500 ml-5">
                              + {item.toppings.map(t => t.name).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="bg-yellow-50 text-yellow-800 p-2 rounded text-xs mb-4 border border-yellow-100">
                        <strong>Note:</strong> {order.notes}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                      {ORDER_STATUSES.map(s => (
                        s !== order.status && s !== 'CANCELLED' && (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(order.orderNumber, s)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
                          >
                            Move to {s.replace(/_/g, ' ')}
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                ))}
                {orders.filter(o => o.status === columnStatus).length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8 italic">No orders</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminApp;
