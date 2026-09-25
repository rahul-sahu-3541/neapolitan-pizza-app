import React, { useState } from 'react';
import useCartStore from '../store/useCartStore';

const PizzaGraphic = () => (
  <div className="w-24 h-24 md:w-32 md:h-32 bg-[#F2AF4D] rounded-full relative flex-shrink-0 transition-transform hover:scale-105">
    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-neo-red rounded-full absolute top-5 left-5 md:top-6 md:left-6"></div>
    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-neo-red rounded-full absolute top-4 right-8 md:top-5 md:right-10"></div>
    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-neo-red rounded-full absolute bottom-7 left-8 md:bottom-9 md:left-10"></div>
    <div className="w-2.5 h-2.5 md:w-3 md:h-3 bg-neo-red rounded-full absolute bottom-4 right-5 md:bottom-6 md:right-7"></div>
  </div>
);

const MenuGrid = ({ categories, onSelectItem }) => {
  const { guest } = useCartStore();
  const [activeFilter, setActiveFilter] = useState('All pizzas');

  if (!categories || categories.length === 0) return null;

  const filters = ['All pizzas', 'Classics', 'Veggie', 'Sides', 'Drinks'];

  // Flatten items for the 'All' view
  const allItems = categories.reduce((acc, cat) => [...acc, ...cat.items], []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-12 pb-32 md:pb-40 animate-in fade-in">
      <div className="mb-6 md:mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-neo-charcoal mb-1 md:mb-2">
          Good evening, {guest.name?.split(' ')[0] || 'Friend'} 👋
        </h2>
        <p className="text-neo-charcoal/60 md:text-lg">What sounds good today?</p>
      </div>

      <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 no-scrollbar mb-4 md:mb-8">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-sm md:text-base font-bold whitespace-nowrap transition-colors ${
              activeFilter === filter 
                ? 'bg-neo-red text-white' 
                : 'bg-white text-neo-charcoal hover:bg-neo-red/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="text-xs md:text-sm font-bold text-neo-charcoal/60 tracking-wider mb-4 md:mb-6 uppercase">Pizzas</h3>
        
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
          {allItems.map((item, idx) => (
            <div 
              key={item.id} 
              className="bg-white rounded-3xl p-5 md:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow border border-black/5 flex items-center gap-4 md:gap-6 cursor-pointer"
              onClick={() => onSelectItem(item)}
            >
              <PizzaGraphic />
              
              <div className="flex-grow">
                <h4 className="font-bold text-lg md:text-xl text-neo-charcoal leading-tight mb-1">{item.name}</h4>
                <p className="text-xs md:text-sm text-neo-charcoal/60 mb-2 md:mb-3 line-clamp-1 md:line-clamp-2">
                  {item.description}
                </p>
                {idx === 1 && (
                  <span className="inline-block bg-red-100 text-neo-red text-[10px] md:text-xs font-bold px-2 py-0.5 rounded mb-2 md:mb-3">
                    BESTSELLER
                  </span>
                )}
                <div className="flex items-center justify-between mt-1 md:mt-4">
                  <span className="font-bold text-lg md:text-2xl">₹{item.basePrice}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelectItem(item); }}
                    className="bg-neo-red hover:bg-neo-red-dark text-white font-bold px-4 md:px-6 py-2 md:py-3 rounded-xl text-sm md:text-base transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuGrid;
