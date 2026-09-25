import React, { useEffect, useState } from 'react';
import { createStompClient } from '../../../services/websocket';
import { trackOrder } from '../../../services/api';
import useCartStore from '../../../store/useCartStore';

const STATUS_STAGES = [
  { status: 'RECEIVED', label: 'Order received', timeLabel: '7:07 PM', detail: "We've got your order." },
  { status: 'IN_OVEN', label: 'In the oven', timeLabel: 'Happening now', highlightTime: true, detail: "Your pizza is baking fresh." },
  { status: 'READY', label: 'Ready for pickup', timeLabel: 'Est. 7:25 PM', detail: "We'll let you know when it's ready." },
  { status: 'COMPLETED', label: 'Picked up', timeLabel: 'Up next', detail: "Enjoy every bite!" }
];

const getMockupStageIndex = (realStatus) => {
  if (realStatus === 'RECEIVED' || realStatus === 'PREPARING') return 0;
  if (realStatus === 'IN_OVEN') return 1;
  if (realStatus === 'READY') return 2;
  if (realStatus === 'COMPLETED') return 3;
  return 0;
};

const LiveTracker = ({ onNewOrder }) => {
  const { currentOrderNumber, currentOrderToken, guest } = useCartStore();
  const [orderState, setOrderState] = useState(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (!currentOrderNumber || !currentOrderToken) return;

    const fetchState = async () => {
      try {
        const data = await trackOrder(currentOrderNumber, currentOrderToken);
        setOrderState(data);
      } catch (err) {
        console.error('Failed to track order', err);
      }
    };
    fetchState();

    const stompClient = createStompClient((c) => {
      c.subscribe(`/topic/orders/${currentOrderNumber}`, (message) => {
        if (message.body) {
          const updatedOrder = JSON.parse(message.body);
          setOrderState(updatedOrder);
        }
      });
    });
    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (stompClient) stompClient.deactivate();
    };
  }, [currentOrderNumber, currentOrderToken]);

  if (!currentOrderNumber || !orderState) return null;

  const currentIndex = getMockupStageIndex(orderState.status);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-12 pb-20 animate-in fade-in slide-in-from-right duration-300">
      
      {/* Success Card */}
      <div className="bg-neo-green/10 rounded-3xl p-5 md:p-8 mb-8 md:mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-neo-green flex items-center gap-3 mb-2">
            <span className="text-2xl md:text-4xl">✓</span> Order placed — we're on it!
          </h2>
          <p className="text-neo-charcoal/60 text-sm md:text-base ml-1 md:ml-10">
            We've sent a confirmation to {guest.phone || '+91 98765 43210'}.
          </p>
        </div>
        <div className="self-start md:self-center">
          <span className="bg-white text-neo-green font-bold text-xs md:text-sm px-4 py-2 rounded-full shadow-sm whitespace-nowrap">
            ORDER # {orderState.orderNumber}
          </span>
        </div>
      </div>

      <div className="mb-6 md:mb-12">
        <h3 className="text-xs md:text-sm font-bold text-neo-charcoal/60 tracking-wider mb-1 md:mb-2">Estimated ready by</h3>
        <div className="text-4xl md:text-6xl font-bold text-neo-red mb-1 md:mb-2">7:25 PM</div>
        <div className="text-sm md:text-base text-neo-charcoal/60">About 18 minutes from now</div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* Left Column: Timeline */}
        <div className="flex-grow">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-black/5 mb-6 md:mb-0 h-full">
            <h3 className="text-lg md:text-xl font-bold text-neo-charcoal mb-8">Live order status</h3>
            
            <div className="relative pl-3 space-y-10">
              {/* Vertical line */}
              <div className="absolute left-[17px] top-2 bottom-6 w-px bg-black/10 z-0"></div>

              {STATUS_STAGES.map((stage, idx) => {
                const isPast = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isFuture = idx > currentIndex;

                return (
                  <div key={idx} className="flex items-start gap-4 md:gap-6 relative z-10">
                    <div className={`w-3.5 h-3.5 rounded-full mt-1.5 shrink-0 transition-colors ${
                      isPast || isCurrent ? 'bg-neo-red' : 'bg-white border-2 border-black/10'
                    }`}></div>
                    <div className="flex-grow flex justify-between items-start">
                      <div>
                        <div className={`font-bold md:text-lg mb-1 ${isFuture ? 'text-neo-charcoal/60' : 'text-neo-charcoal'}`}>
                          {stage.label}
                        </div>
                        <div className="text-xs md:text-sm text-neo-charcoal/50">
                          {stage.detail}
                        </div>
                      </div>
                      <span className={`text-xs md:text-sm font-bold whitespace-nowrap ${stage.highlightTime && isCurrent ? 'text-neo-red' : 'text-neo-charcoal/50'}`}>
                        {stage.timeLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Details */}
        <div className="w-full md:w-80 lg:w-96 shrink-0">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-black/5 mb-8">
            <h3 className="text-lg md:text-xl font-bold text-neo-charcoal mb-6 md:mb-8">Order details</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-neo-charcoal/60 tracking-wider uppercase mb-1">Order Number</h4>
                <div className="font-bold md:text-lg text-neo-charcoal">{orderState.orderNumber}</div>
              </div>
              
              <div>
                <h4 className="text-[10px] font-bold text-neo-charcoal/60 tracking-wider uppercase mb-1">Order Type</h4>
                <div className="font-bold md:text-lg text-neo-charcoal">Pickup at restaurant</div>
              </div>
              
              <div className="border-b border-black/5 pb-6">
                <h4 className="text-[10px] font-bold text-neo-charcoal/60 tracking-wider uppercase mb-1">Payment</h4>
                <div className="font-bold md:text-lg text-neo-charcoal">Cash on pickup</div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-neo-red cursor-pointer hover:underline">Need help? Call (555) 014-2020</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <button 
          onClick={onNewOrder}
          className="w-full md:w-48 bg-neo-red hover:bg-neo-red-dark text-white rounded-xl py-4 flex items-center justify-center font-bold transition-transform active:scale-95 shadow-md shadow-neo-red/20"
        >
          Back to menu
        </button>
        <div className="text-center md:text-left text-xs md:text-sm text-neo-charcoal/50">
          Your order updates automatically on this page.
        </div>
      </div>
    </div>
  );
};

export default LiveTracker;
