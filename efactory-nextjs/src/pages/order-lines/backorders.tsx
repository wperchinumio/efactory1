import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrderLinesBackordersPage() {
  return (
    <GridPage
      resource="fulfillment-lines-backorders"
      pageKey="order-lines-backorders"
      paginationWord="lines"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
