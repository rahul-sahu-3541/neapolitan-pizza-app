import React, { useState } from 'react';
import { LayoutDashboard, ChefHat, UtensilsCrossed, Settings, BellRing, ChevronRight, Store } from 'lucide-react';
import AdminOrders from './components/AdminOrders';
import AdminMenu from './components/AdminMenu';
import AdminAnalytics from './components/AdminAnalytics';
import AdminLogin from './components/AdminLogin';

const AdminApp = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminKey'));

  const handleLogin = (pin) => {
    localStorage.setItem('adminKey', pin);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminKey');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* Sidebar - Zomato Partner Style */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl z-20 hidden md:flex">
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-neo-red rounded-lg flex items-center justify-center shadow-lg shadow-neo-red/20">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold tracking-wide text-lg leading-tight">Partner Central</h1>
            <p className="text-xs text-gray-400">Al Forno Pizzeria</p>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          <NavItem 
            icon={<BellRing size={20} />} 
            label="Live Orders" 
            isActive={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')}
            badge="!"
          />
          <NavItem 
            icon={<UtensilsCrossed size={20} />} 
            label="Menu & Catalog" 
            isActive={activeTab === 'menu'} 
            onClick={() => setActiveTab('menu')}
          />
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Business Insights" 
            isActive={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')}
          />
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <a href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
            <ChefHat size={20} />
            View Customer App
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:text-white hover:bg-red-900/50 rounded-xl transition-all">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 shadow-sm z-10 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {activeTab === 'orders' && 'Order Management'}
            {activeTab === 'menu' && 'Menu & Catalog'}
            {activeTab === 'analytics' && 'Business Insights'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-gray-600 tracking-wide">ACCEPTING ORDERS</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'orders' && <AdminOrders />}
            {activeTab === 'menu' && <AdminMenu />}
            {activeTab === 'analytics' && <AdminAnalytics />}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, isActive, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-neo-red text-white shadow-md shadow-neo-red/20' 
        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <div className="flex items-center gap-3 font-medium text-sm">
      {icon}
      {label}
    </div>
    {badge && isActive && (
      <span className="bg-white text-neo-red w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black animate-pulse">
        {badge}
      </span>
    )}
  </button>
);

export default AdminApp;
