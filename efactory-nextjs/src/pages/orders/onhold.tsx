import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrdersOnHoldPage() {
  return (
    <GridPage
      resource="fulfillment-onhold"
      pageKey="orders-onhold"
      paginationWord="orders"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
