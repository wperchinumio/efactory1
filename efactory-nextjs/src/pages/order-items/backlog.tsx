import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function OrderItemsBacklogPage() {
  return (
    <GridPage
      resource="inventory-backlog"
      pageKey="order-items-backlog"
      paginationWord="rows"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}
