import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsCycleCountPage() {
  return (
    <GridPage
      resource="inventory-cyclecount"
      pageKey="inventory-cyclecount"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


