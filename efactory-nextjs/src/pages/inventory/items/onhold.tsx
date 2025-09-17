import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsOnHoldPage() {
  return (
    <GridPage
      resource="inventory-onhold"
      pageKey="inventory-onhold"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


