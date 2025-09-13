import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrdersPrereleasePage() {
  return (
    <GridPage
      resource="fulfillment-risk"
      pageKey="orders-prerelease"
      paginationWord="orders"
      showIndexColumn
      showOrderTypeColumn
    />
  );
}
