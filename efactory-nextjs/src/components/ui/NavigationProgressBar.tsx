import React from 'react';
import { useNavigationLoading } from '@/contexts/NavigationLoadingContext';

const NavigationProgressBar: React.FC = () => {
  const { isNavigating, progress } = useNavigationLoading();

  if (!isNavigating) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      {/* Background track */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 opacity-30" />
      
      {/* Progress bar with gradient and glow effect */}
      <div 
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary transition-all duration-150 ease-out shadow-lg overflow-hidden"
        style={{
          width: `${progress}%`,
          filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))',
        }}
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent navigation-progress-pulse" />
        
        {/* Moving highlight - using custom shimmer animation */}
        <div className="absolute top-0 -right-20 w-20 h-full bg-gradient-to-l from-white/40 to-transparent navigation-progress-shimmer" />
      </div>
    </div>
  );
};

export default NavigationProgressBar;
