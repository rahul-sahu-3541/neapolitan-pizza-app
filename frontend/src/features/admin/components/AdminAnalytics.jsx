import React, { useState, useEffect } from 'react';
import { fetchAdminAnalytics, fetchAllOrders } from '../../../services/api';
import { TrendingUp, ShoppingBag, Activity, Calendar, Download, ChevronRight } from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stats, orders] = await Promise.all([
          fetchAdminAnalytics(),
          fetchAllOrders()
        ]);
        setAnalytics(stats);
        setHistory(orders);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="h-full flex items-center justify-center font-bold text-gray-400">Loading business insights...</div>;

  return (
    <div className="space-y-6 h-full flex flex-col animate-in fade-in pb-12">
      
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center gap-5 relative overflow-hidden">
          <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
            <TrendingUp size={28} />
          </div>
          <div>
            <div className="text-gray-500 font-bold text-[11px] uppercase tracking-wider mb-1">Total Revenue</div>
            <div className="text-3xl font-black text-gray-900">₹{analytics?.totalRevenue || 0}</div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-green-50 opacity-50">
            <TrendingUp size={100} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center gap-5 relative overflow-hidden">
          <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
            <ShoppingBag size={28} />
          </div>
          <div>
            <div className="text-gray-500 font-bold text-[11px] uppercase tracking-wider mb-1">Total Orders</div>
            <div className="text-3xl font-black text-gray-900">{analytics?.totalOrders || 0}</div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-50">
            <ShoppingBag size={100} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex items-center gap-5 relative overflow-hidden">
          <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
            <Activity size={28} />
          </div>
          <div>
            <div className="text-gray-500 font-bold text-[11px] uppercase tracking-wider mb-1">Active Kitchen Orders</div>
            <div className="text-3xl font-black text-gray-900">{analytics?.activeOrders || 0}</div>
          </div>
          <div className="absolute -right-4 -bottom-4 text-orange-50 opacity-50">
            <Activity size={100} />
          </div>
        </div>

      </div>

      {/* Main Order History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" />
            Recent Order History
          </h3>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <Download size={16} /> Export CSV
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white sticky top-0 z-10 shadow-sm">
              <tr className="border-b border-gray-200 text-[11px] text-gray-400 uppercase tracking-wider font-bold">
                <th className="p-4 px-6">Order ID & Time</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Order Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right px-6">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {history.map((order, idx) => (
                <tr key={order.orderNumber} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  
                  <td className="p-4 px-6">
                    <div className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{order.orderNumber}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString([], {month:'short', day:'numeric', hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  
                  <td className="p-4">
                    <div className="font-bold text-gray-700 text-sm">{order.customerName}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{order.customerPhone}</div>
                  </td>
                  
                  <td className="p-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide">
                      {order.orderType.replace('_', ' ')}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  
                  <td className="p-4 px-6 text-right">
                    <div className="font-black text-gray-900">₹{order.totalAmount}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{order.paymentStatus}</div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && (
            <div className="p-12 text-center text-gray-400 font-bold">No orders found.</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminAnalytics;
