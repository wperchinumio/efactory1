import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrderLinesAllPage() {
  return (
    <GridPage
      resource="fulfillment-lines-any"
      pageKey="order-lines-all"
      paginationWord="lines"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
