import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface NavigationLoadingContextType {
  isNavigating: boolean;
  progress: number;
}

const NavigationLoadingContext = createContext<NavigationLoadingContextType | undefined>(undefined);

export const useNavigationLoading = (): NavigationLoadingContextType => {
  const context = useContext(NavigationLoadingContext);
  if (!context) {
    throw new Error('useNavigationLoading must be used within a NavigationLoadingProvider');
  }
  return context;
};

interface NavigationLoadingProviderProps {
  children: ReactNode;
}

export const NavigationLoadingProvider: React.FC<NavigationLoadingProviderProps> = ({ children }) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;
    let progressValue = 0;

    const handleRouteChangeStart = (url: string) => {
      // Only exclude hash-only changes, but include query parameter changes
      const currentPathWithQuery = router.asPath.split('#')[0];
      const newPathWithQuery = url.split('#')[0];
      
      // If only the hash changed, don't show loading
      if (currentPathWithQuery === newPathWithQuery) {
        return;
      }

      setIsNavigating(true);
      setProgress(0);
      progressValue = 0;

      // Simulate progress with faster, more responsive timing
      const updateProgress = () => {
        progressValue += Math.random() * 25 + 10; // 10-35% increments
        if (progressValue > 85) {
          progressValue = 85; // Cap at 85% until route change completes
        }
        setProgress(progressValue);

        if (progressValue < 85) {
          progressTimer = setTimeout(updateProgress, 50 + Math.random() * 100); // 50-150ms intervals
        }
      };

      updateProgress();
    };

    const handleRouteChangeComplete = () => {
      if (progressTimer) {
        clearTimeout(progressTimer);
      }
      
      // Complete the progress bar
      setProgress(100);
      
      // Hide immediately after a very short delay to show completion
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 100); // Reduced from 200ms to 100ms
    };

    const handleRouteChangeError = () => {
      if (progressTimer) {
        clearTimeout(progressTimer);
      }
      setIsNavigating(false);
      setProgress(0);
    };

    // Listen to router events
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      if (progressTimer) {
        clearTimeout(progressTimer);
      }
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  return (
    <NavigationLoadingContext.Provider value={{ isNavigating, progress }}>
      {children}
    </NavigationLoadingContext.Provider>
  );
};
