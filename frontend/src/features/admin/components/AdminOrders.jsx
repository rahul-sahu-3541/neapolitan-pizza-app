import React, { useState, useEffect } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../../../services/api';
import { Check, Clock, PackageCheck, AlertCircle, Printer, ChefHat, CheckCircle2 } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('RECEIVED');

  const loadOrders = async () => {
    try {
      const data = await fetchAllOrders();
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

  const newOrders = orders.filter(o => o.status === 'RECEIVED');
  const preparingOrders = orders.filter(o => o.status === 'PREPARING' || o.status === 'IN_OVEN');
  const readyOrders = orders.filter(o => o.status === 'READY' || o.status === 'CASH_COLLECTED');
  const completedOrders = orders.filter(o => o.status === 'COMPLETED');

  const displayedOrders = activeTab === 'RECEIVED' ? newOrders :
                          activeTab === 'PREPARING' ? preparingOrders : 
                          activeTab === 'COMPLETED' ? completedOrders : readyOrders;

  if (loading && orders.length === 0) {
    return <div className="h-full flex items-center justify-center font-bold text-gray-400">Syncing live orders...</div>;
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in">
      
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-px overflow-x-auto">
        <TabButton 
          label="New Orders" 
          count={newOrders.length} 
          isActive={activeTab === 'RECEIVED'} 
          onClick={() => setActiveTab('RECEIVED')}
          colorClass="bg-red-500"
        />
        <TabButton 
          label="Preparing & Baking" 
          count={preparingOrders.length} 
          isActive={activeTab === 'PREPARING'} 
          onClick={() => setActiveTab('PREPARING')}
          colorClass="bg-yellow-500"
        />
        <TabButton 
          label="Ready & Pickup" 
          count={readyOrders.length} 
          isActive={activeTab === 'READY'} 
          onClick={() => setActiveTab('READY')}
          colorClass="bg-green-500"
        />
        <TabButton 
          label="Completed" 
          count={completedOrders.length} 
          isActive={activeTab === 'COMPLETED'} 
          onClick={() => setActiveTab('COMPLETED')}
          colorClass="bg-gray-500"
        />
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-y-auto pb-12">
        {displayedOrders.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3">
            <CheckCircle2 size={48} className="opacity-20" />
            <p className="font-bold text-lg">No orders in this stage</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {displayedOrders.map(order => (
              <div key={order.orderNumber} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className={`p-4 text-white flex justify-between items-center ${
                  activeTab === 'RECEIVED' ? 'bg-red-600' :
                  activeTab === 'PREPARING' ? 'bg-gray-800' : 
                  activeTab === 'COMPLETED' ? 'bg-gray-400' : 'bg-green-600'
                }`}>
                  <div>
                    <h3 className="font-black text-xl tracking-wide">{order.orderNumber}</h3>
                    <div className="text-xs opacity-90 font-medium">Placed at {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-xl">₹{order.totalAmount}</div>
                    <div className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded uppercase tracking-wider">{order.paymentStatus.replace('_', ' ')}</div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="font-bold text-gray-800 text-lg">{order.customerName}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        {order.customerPhone} 
                        {order.orderType === 'DINE_IN' && <span className="ml-2 font-bold text-neo-red px-2 py-0.5 bg-red-50 rounded text-xs">Table {order.tableNumber}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Items</div>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-gray-800"><span className="text-neo-red mr-2">{item.quantity}x</span> {item.itemName}</div>
                          {item.toppings && item.toppings.length > 0 && (
                            <div className="text-xs text-gray-500 ml-6 leading-tight mt-1">
                              + {item.toppings.map(t => t.name).join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-gray-700 text-sm">₹{item.subtotal}</div>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="mt-4 bg-yellow-50 text-yellow-800 p-3 rounded-xl text-sm border border-yellow-100 flex gap-2 items-start">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <strong>Customer Note:</strong> {order.notes}
                    </div>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center gap-3">
                  <button className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-xl transition-colors border border-gray-200" title="Print Bill">
                    <Printer size={20} />
                  </button>

                  <div className="flex-1 flex gap-3 justify-end">
                    {activeTab === 'RECEIVED' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(order.orderNumber, 'CANCELLED')}
                          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleStatusChange(order.orderNumber, 'PREPARING')}
                          className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 shadow-md shadow-red-600/20"
                        >
                          <ChefHat size={18} /> Accept & Prep
                        </button>
                      </>
                    )}

                    {activeTab === 'PREPARING' && (
                      <>
                        {order.status === 'PREPARING' && (
                          <button 
                            onClick={() => handleStatusChange(order.orderNumber, 'IN_OVEN')}
                            className="px-6 py-3 bg-white border border-gray-300 text-gray-800 font-bold rounded-xl hover:bg-gray-50 transition-colors w-full"
                          >
                            Move to Oven (Baking)
                          </button>
                        )}
                        {order.status === 'IN_OVEN' && (
                          <button 
                            onClick={() => handleStatusChange(order.orderNumber, 'READY')}
                            className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-md shadow-black/20 w-full"
                          >
                            <PackageCheck size={18} /> Food is Ready
                          </button>
                        )}
                      </>
                    )}

                    {activeTab === 'READY' && (
                      <>
                        {order.status === 'READY' && order.paymentMethod === 'PAY_AT_COUNTER' ? (
                          <button 
                            onClick={async () => {
                              try {
                                await updateOrderStatus(order.orderNumber, { status: 'CASH_COLLECTED', paymentStatus: 'PAID' });
                                loadOrders();
                              } catch(e) { 
                                console.error(e); 
                                alert('Failed to collect cash: ' + (e.response?.data?.message || e.message)); 
                              }
                            }}
                            className="px-6 py-3 bg-yellow-500 text-yellow-950 font-black rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-md shadow-yellow-500/20 w-full justify-center"
                          >
                            Collect Cash ₹{order.totalAmount}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleStatusChange(order.orderNumber, 'COMPLETED')}
                            className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md shadow-green-600/20 w-full justify-center"
                          >
                            <Check size={18} /> Mark Delivered & Complete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ label, count, isActive, onClick, colorClass }) => (
  <button
    onClick={onClick}
    className={`pb-4 px-2 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
      isActive ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
    <span className={`px-2 py-0.5 rounded-full text-xs text-white ${colorClass}`}>
      {count}
    </span>
  </button>
);

export default AdminOrders;
