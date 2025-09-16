import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function TransportationShippingDetailPage() {
  return (
    <GridPage
      resource="fulfillment-freight" 
      pageKey="transportation-shipping-detail"
      paginationWord="orders"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}


