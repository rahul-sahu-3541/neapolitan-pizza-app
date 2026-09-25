import React, { useState, useEffect } from 'react';
import useCartStore from './store/useCartStore';
import Header from './components/Header';
import Step1Details from './components/Step1Details';
import MenuGrid from './components/MenuGrid';
import PizzaCustomizer from './components/PizzaCustomizer';
import BottomCartBar from './components/BottomCartBar';
import OrderSummary from './components/OrderSummary';
import LiveTracker from './components/LiveTracker';
import { fetchMenu } from './services/api';

function App() {
  const { guest, currentOrderNumber, addToCart } = useCartStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [menuData, setMenuData] = useState({ categories: [], availableToppings: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await fetchMenu();
        setMenuData(data);
      } catch (err) {
        console.error("Failed to load menu", err);
        setError("Could not load the menu. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadMenu();
  }, []);

  useEffect(() => {
    if (currentOrderNumber) {
      setCurrentStep(4);
    } else if (guest.name) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [guest.name, currentOrderNumber]);

  return (
    <div className="min-h-screen bg-neo-cream font-sans text-neo-charcoal relative">
      <Header currentStep={currentStep} setStep={setCurrentStep} />
      
      <main>
        {currentStep === 1 && (
          <Step1Details onNext={() => setCurrentStep(2)} />
        )}

        {currentStep === 2 && (
          isLoading ? (
            <div className="text-center py-20 animate-pulse text-neo-charcoal/50 font-bold text-xl">Firing up the oven...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 font-bold">{error}</div>
          ) : (
            <MenuGrid 
              categories={menuData.categories} 
              onSelectItem={(item) => setSelectedPizza(item)} 
            />
          )
        )}

        {currentStep === 3 && (
          <OrderSummary 
            onOrderPlaced={() => setCurrentStep(4)} 
          />
        )}

        {currentStep === 4 && (
          <LiveTracker onNewOrder={() => setCurrentStep(1)} />
        )}
      </main>

      <BottomCartBar 
        currentStep={currentStep} 
        onCheckout={() => setCurrentStep(3)} 
      />

      {selectedPizza && (
        <PizzaCustomizer 
          item={selectedPizza} 
          availableToppings={menuData.availableToppings}
          onClose={() => setSelectedPizza(null)} 
          onAdd={(customizedItem) => {
             addToCart(customizedItem);
             setSelectedPizza(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
