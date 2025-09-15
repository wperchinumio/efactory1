import React from 'react';
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext';

const NavigationOverlay: React.FC = () => {
  const { isNavigating } = useNavigationLoading();

  if (!isNavigating) {
    return null;
  }

  return (
    <>
      {/* Overlay to prevent interactions - covers everything except the progress bar */}
      <div 
        className="fixed inset-0 z-[9998] bg-transparent cursor-wait"
        style={{ 
          pointerEvents: 'all',
          top: '1px' // Start below the progress bar
        }}
      />
      
      {/* Subtle blur overlay for main content area only */}
      <div 
        className="fixed z-[9997] pointer-events-none transition-all duration-150 ease-in-out"
        style={{
          top: '74px', // Start below the header (adjust based on header height)
          left: '0',
          right: '0',
          bottom: '0',
          backdropFilter: 'blur(0.5px)',
          background: 'rgba(255, 255, 255, 0.02)',
        }}
      />
    </>
  );
};

export default NavigationOverlay;
