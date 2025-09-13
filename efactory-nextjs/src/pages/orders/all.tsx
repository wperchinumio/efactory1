import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrdersAllPage() {
  return (
    <GridPage
      resource="fulfillment-any"
      pageKey="orders-all"
      paginationWord="orders"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
