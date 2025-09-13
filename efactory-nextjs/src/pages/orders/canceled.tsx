import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrdersCanceledPage() {
  return (
    <GridPage
      resource="fulfillment-cancelled"
      pageKey="orders-canceled"
      paginationWord="orders"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
