import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrderLinesCanceledPage() {
  return (
    <GridPage
      resource="fulfillment-lines-cancelled"
      pageKey="order-lines-canceled"
      paginationWord="lines"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
