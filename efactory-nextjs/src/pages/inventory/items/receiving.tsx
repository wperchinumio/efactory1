import React from 'react';
import GridPage from '@/components/common/GridPage';

export default function ItemsReceivingPage() {
  return (
    <GridPage
      resource="inventory-receiving"
      pageKey="inventory-receiving"
      paginationWord="items"
      showIndexColumn
      showOrderTypeColumn={false}
    />
  );
}


