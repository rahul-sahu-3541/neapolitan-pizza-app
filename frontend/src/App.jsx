import React, { useState, useEffect } from 'react';
import useCartStore from './store/useCartStore';
import Header from './components/Header';
import Step1Details from './components/Step1Details';
import MenuGrid from './components/MenuGrid';
import PizzaCustomizer from './components/PizzaCustomizer';
import BottomCartBar from './components/BottomCartBar';
import OrderSummary from './components/OrderSummary';
import LiveTracker from './components/LiveTracker';

// Mock Data (will be replaced by API call)
const MOCK_CATEGORIES = [
  {
    id: 1, name: 'Pizze Rosse', description: 'Classic red base with San Marzano tomatoes DOP',
    items: [
      { id: 101, name: 'Margherita', basePrice: 329, description: 'Tomato, mozzarella, basil', dietaryType: 'VEG', sourdoughNotes: '48hr fermented sourdough base' },
      { id: 102, name: 'Pepperoni Feast', basePrice: 449, description: 'Double pepperoni, mozzarella', dietaryType: 'NON_VEG' },
      { id: 103, name: 'Garden Party', basePrice: 399, description: 'Peppers, olives, feta', dietaryType: 'VEG' }
    ]
  },
];

const MOCK_TOPPINGS = [
  { id: 1, name: 'Extra Cheese', price: 50, dietaryType: 'VEG' },
  { id: 2, name: 'Olives', price: 30, dietaryType: 'VEG' },
];

function App() {
  const { guest, currentOrderNumber, addToCart } = useCartStore();
  
  // Step 1: Details, Step 2: Menu, Step 3: Checkout, Step 4: Track
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPizza, setSelectedPizza] = useState(null);

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
          <MenuGrid 
            categories={MOCK_CATEGORIES} 
            onSelectItem={(item) => setSelectedPizza(item)} 
          />
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
          availableToppings={MOCK_TOPPINGS}
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
