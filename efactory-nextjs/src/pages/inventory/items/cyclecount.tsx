import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsCycleCountPage() {
  return (
    <GridPage
      resource="inventory-cyclecount"
      pageKey="items-cyclecount"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


