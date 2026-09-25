import React, { useState } from 'react';
import useCartStore from '../store/useCartStore';

const Step1Details = ({ onNext }) => {
  const { guest, setGuestDetails } = useCartStore();
  const [formData, setFormData] = useState({
    name: guest.name || '',
    phone: guest.phone || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setGuestDetails(formData);
      onNext();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
        
        {/* Left Column */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neo-charcoal leading-tight mb-4">
            Your next favorite<br className="hidden md:block" /> pizza starts here.
          </h2>
          <p className="text-neo-charcoal/60 text-lg md:text-xl mb-6 md:mb-8 md:pr-12">
            Hand-stretched dough, slow-simmered sauce, and the good stuff on top. Ready in about 25 minutes.
          </p>
          
          <div className="hidden md:inline-flex bg-neo-red/10 text-neo-red text-xs font-bold px-4 py-2 rounded-full w-fit mb-12">
            WOOD-FIRED • MADE TO ORDER
          </div>

          {/* Details Form */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-black/5 w-full md:max-w-md">
            <h3 className="text-2xl font-bold text-neo-charcoal mb-1">Let's get your order started</h3>
            <p className="text-neo-charcoal/60 text-sm mb-6">No account needed. We'll use these details for your order.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-neo-charcoal/60 tracking-wider mb-2">YOUR NAME</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-black/10 rounded-xl p-4 bg-neo-cream/30 focus:ring-2 focus:ring-neo-red focus:border-neo-red outline-none transition-all placeholder:text-black/30"
                    placeholder="e.g. Alex Morgan"
                    required
                  />
                </div>
                
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-neo-charcoal/60 tracking-wider mb-2">PHONE NUMBER</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-black/10 rounded-xl p-4 bg-neo-cream/30 focus:ring-2 focus:ring-neo-red focus:border-neo-red outline-none transition-all placeholder:text-black/30"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <p className="text-[11px] text-neo-charcoal/40 pt-2 md:hidden">We'll text your order updates here.</p>

              <button 
                type="submit" 
                className="w-full bg-neo-red hover:bg-neo-red-dark text-white font-bold py-4 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
              >
                Explore the menu <span>→</span>
              </button>
              <p className="hidden md:block text-[10px] text-neo-charcoal/40 text-center mt-2">Order-related SMS only. No account or password required.</p>
            </form>
          </div>
        </div>

        {/* Right Column - Hero Card */}
        <div className="w-full md:w-1/2 flex justify-center items-center h-full">
          <div className="bg-neo-red rounded-3xl p-8 md:p-12 lg:p-20 flex flex-col items-center justify-center text-white shadow-lg shadow-neo-red/20 aspect-video md:aspect-[4/3] w-full relative overflow-hidden">
            <div className="w-32 h-32 md:w-56 md:h-56 bg-[#F6C667] rounded-full flex items-center justify-center border-[8px] md:border-[16px] border-[#FBE5A2] relative z-10 transition-transform hover:scale-105 duration-500">
              <div className="w-24 h-24 md:w-40 md:h-40 bg-[#5F1A1B] rounded-full relative">
                <div className="w-3 h-3 md:w-5 md:h-5 bg-neo-red rounded-full absolute top-3 left-4 md:top-5 md:left-6"></div>
                <div className="w-3 h-3 md:w-5 md:h-5 bg-neo-red rounded-full absolute top-2 right-6 md:top-4 md:right-10"></div>
                <div className="w-3 h-3 md:w-5 md:h-5 bg-neo-red rounded-full absolute bottom-4 left-6 md:bottom-8 md:left-10"></div>
                <div className="w-3 h-3 md:w-5 md:h-5 bg-neo-red rounded-full absolute bottom-6 right-4 md:bottom-10 md:right-8"></div>
                <div className="w-3 h-3 md:w-5 md:h-5 bg-neo-red rounded-full absolute top-10 left-10 md:top-16 md:left-16"></div>
              </div>
            </div>
            <div className="text-[10px] md:text-sm font-bold tracking-widest mt-6 md:mt-8 relative z-10">HOT • CRISPY • HAPPY</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Step1Details;
