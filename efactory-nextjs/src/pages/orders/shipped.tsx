import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrdersShippedPage() {
  return (
    <GridPage
      resource="fulfillment-shipped"
      pageKey="orders-shipped"
      paginationWord="orders"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}


