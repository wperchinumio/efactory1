import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function InventoryAssemblyPage() {
  return (
    <GridPage
      resource="inventory-assembly"
      pageKey="inventory-assembly"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


