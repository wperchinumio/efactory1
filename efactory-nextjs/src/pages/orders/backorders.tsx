import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrdersBackordersPage() {
  return (
    <GridPage
      resource="fulfillment-backorders"
      pageKey="orders-backorders"
      paginationWord="orders"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
