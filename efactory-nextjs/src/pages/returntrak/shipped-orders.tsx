import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ReturnTrakShippedOrdersPage() {
  return (
    <GridPage
      resource="fulfillment-rma"
      pageKey="returntrak-shipped-orders"
      paginationWord="orders"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}


