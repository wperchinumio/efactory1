import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrderItemsAllPage() {
  return (
    <GridPage
      resource="inventory-all-items"
      pageKey="order-items-all"
      paginationWord="rows"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}
