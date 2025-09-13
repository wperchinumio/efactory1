import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrderLinesShippedPage() {
  return (
    <GridPage
      resource="fulfillment-lines-shipped"
      pageKey="order-lines-shipped"
      paginationWord="lines"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
