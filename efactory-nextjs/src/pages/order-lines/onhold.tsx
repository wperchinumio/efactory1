import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrderLinesOnHoldPage() {
  return (
    <GridPage
      resource="fulfillment-lines-onhold"
      pageKey="order-lines-onhold"
      paginationWord="lines"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
