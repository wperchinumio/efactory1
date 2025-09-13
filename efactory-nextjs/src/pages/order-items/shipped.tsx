import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrderItemsShippedPage() {
  return (
    <GridPage
      resource="inventory-shipped"
      pageKey="order-items-shipped"
      paginationWord="rows"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}
