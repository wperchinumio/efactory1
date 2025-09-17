import React from 'react';
import Head from 'next/head';
import RateCardsGrid from '@/components/transportation/RateCardsGrid';

export default function RateCardsPage() {
  // No need for JavaScript height calculation - using CSS calc instead

  return (
    <>
      <Head>
        <title>Rate Cards - eFactory</title>
        <meta name="description" content="Professional shipping rate cards for different carriers and regions" />
      </Head>

      <div className="bg-background-color">
        <div className="px-4 py-4 w-full max-w-[1600px] mx-auto">
          <RateCardsGrid 
            className="w-full shadow-xl rounded-lg overflow-hidden"
          />
        </div>
      </div>
    </>
  );
}
