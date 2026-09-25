import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ currentStep, setStep }) => {
  const steps = [
    { id: 1, label: '01 DETAILS' },
    { id: 2, label: '02 MENU' },
    { id: 3, label: '03 CHECKOUT' },
    { id: 4, label: '04 TRACK' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-neo-cream">
      <div className="max-w-6xl mx-auto">
        <div className="px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setStep(1)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2001/svg" className="text-neo-red">
              <path d="M12 2C6.48 2 2 6.48 2 12V22H22V12C22 6.48 17.52 2 12 2ZM12 10C10.34 10 9 11.34 9 13H15C15 11.34 13.66 10 12 10ZM4 20V12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12V20H4Z" fill="currentColor"/>
              <path d="M10 15H14V17H10V15Z" fill="currentColor"/>
            </svg>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neo-red font-sans">
              AL FORNO
            </h1>
          </div>
          
          <div className="hidden md:block text-sm text-neo-charcoal/50">
            Fresh from our oven · Open until 11 PM
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-bold text-neo-charcoal">
            <button className="hover:text-neo-red transition-colors">How it works</button>
            <button className="hover:text-neo-red transition-colors" onClick={() => setStep(2)}>Menu</button>
            <button className="hover:text-neo-red transition-colors">Contact</button>
          </div>

          <button className="md:hidden p-2 text-neo-charcoal hover:bg-black/5 rounded-full transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Sub-navigation Steps */}
        <div className="px-4 pb-4">
          <div className="h-[1px] bg-neo-charcoal/10 w-full mb-3 hidden md:block"></div>
          <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs font-bold text-neo-charcoal/60 tracking-wider">
            {steps.map((step, index) => {
              const isPast = step.id < currentStep;
              const isCurrent = step.id === currentStep;
              
              return (
                <React.Fragment key={step.id}>
                  <span className={`${(isPast || isCurrent) ? 'text-neo-charcoal' : ''}`}>
                    {step.label} {isPast && '✓'}
                  </span>
                  {index < steps.length - 1 && <span>·</span>}
                </React.Fragment>
              );
            })}
          </div>
          <div className="h-[2px] bg-neo-charcoal/10 w-full mt-2 md:hidden"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
