import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { getBaseUrl } from '../../../services/api';

const AdminLogin = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pin.trim() !== '') {
      try {
        setLoading(true);
        await axios.get(`${getBaseUrl()}/admin/verify`, {
          headers: { 'X-Admin-Key': pin }
        });
        onLogin(pin);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700 animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-700/50 p-4 rounded-full border border-gray-600">
            <ShieldCheck size={48} className="text-neo-red" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black text-center text-white mb-2 tracking-wide">
          Admin Area
        </h2>
        <p className="text-center text-gray-400 mb-8 font-medium">
          Enter your secure pin to access the restaurant dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                className={`block w-full pl-11 pr-4 py-4 bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-2xl text-white font-bold text-lg focus:ring-neo-red focus:border-neo-red transition-all`}
                placeholder="Enter PIN..."
                autoFocus
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-400 font-bold">{pin.trim() === '' ? 'Please enter a PIN.' : 'Invalid PIN.'}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-red-900 cursor-not-allowed' : 'bg-neo-red hover:bg-red-700'} text-white font-black text-lg py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] shadow-lg shadow-red-600/30`}
          >
            {loading ? 'Verifying...' : 'Unlock Dashboard'} {!loading && <ArrowRight size={20} />}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">
            Al Forno Pizzeria &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
