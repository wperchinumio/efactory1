import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrderLinesOpenPage() {
  return (
    <GridPage
      resource="fulfillment-lines-open"
      pageKey="order-lines-open"
      paginationWord="lines"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
