import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import RateCardsGrid from '@/components/transportation/RateCardsGrid';

export default function RateCardsPage() {
  const [gridHeight, setGridHeight] = useState(500);

  // Handle window resize for responsive grid height
  useEffect(() => {
    const handleResize = () => {
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - 400; // Reserve space for header, filters, and disclosure
      const newHeight = Math.max(400, Math.min(800, availableHeight));
      setGridHeight(newHeight);
    };

    // Set initial height
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Head>
        <title>Rate Cards - eFactory</title>
        <meta name="description" content="Shipping rate cards for different carriers and regions" />
      </Head>

      <div className="min-h-screen bg-background-color">
        <div className="container mx-auto px-4 py-6">
          <RateCardsGrid 
            className="max-w-full"
            style={{ '--grid-height': `${gridHeight}px` } as React.CSSProperties}
          />
        </div>
      </div>
    </>
  );
}
