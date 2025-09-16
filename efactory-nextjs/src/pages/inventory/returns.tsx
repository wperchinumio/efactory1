import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function InventoryReturnsPage() {
  return (
    <GridPage
      resource="inventory-returns"
      pageKey="inventory-returns"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


